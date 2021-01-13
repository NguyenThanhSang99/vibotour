import dotenv from "dotenv";
import pool from "../db/pool.js";
import { sendEmail, parse} from "../utils/emailUtil.js";
import Stripe from "stripe";
import QRCode from "qrcode";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { v4 as uuidv4 } from "uuid";

import {
  checkoutHtmlPage,
  checkoutSuccessHtmlPage,
  checkoutCanceledHtmlPage
} from '../helper/htmlPages.js';

const payTour = async (req, res) => {
  let status;
  try {
    const { product, token } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const idempotencyKey = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: product.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      {
        idempotencyKey,
      }
    );
    console.log("Charge ID:", charge.id);
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }
  res.status(200).json(status);
};

const checkout = async (req, res) => {
  
  try {
    const { items, email, userId } = req.body;
    /* 
      For the demonstration purpose, I am using req.body.items to create line_items, 
      but you shouldn't use it in production, mallicious users may change price of items in body before sending to server,
      rather get items from the database using id received in body.
    */
   const order_items = [];
   for(let i=0; i<items.length; i++) {
     order_items.push({
       name: items[i].bookedTourId,
       amount: items[i].cost,
       currency: 'vnd',
       quantity: items[i].count
     });
   }
    
    /*
    const order = await database.createOrder({items: req.body.items, platform: req.body.platform, amount, createdAt: new Date().toISOString(), paymentStatus: 'pending'});
    */

    let success_url = '';
    let cancel_url = '';
    if(req.body.platform === 'web') {
      success_url = `${process.env.SERVER_IP}/api/v1/payment/success?platform=web`;
      cancel_url = `${process.env.SERVER_IP}/api/v1/payment/cancel?platform=web`;
    }
    else {
      success_url = `${process.env.SERVER_IP}/api/v1/payment/success`;
      cancel_url = `${process.env.SERVER_IP}/api/v1/payment/cancel`;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order_items,
      success_url,
      cancel_url,
      client_reference_id: userId,
      customer_email: email,
    });
    
    res.send({orderId: userId, sessionId: session.id});
  }
  catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
}

const saveTicket = (req, res) => {
  const {
    itemList,
    userId,
    firstName,
    lastName,
    email,
    gender,
    phone,
    note,
  } = req.body;
  let itemSuccess = [];
  
  const promises = new Promise((resolve, reject) => {
    itemList.forEach(item => {
      pool.query(
        "CALL P_PaidTour($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);",
        [
          item.bookedTourId,
          userId,
          item.tourId,
          firstName,
          lastName,
          email,
          gender,
          phone,
          item.count,
          note,
        ],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          } else {
            itemSuccess.push({
              bookedTourId: item.bookedTourId,
              tourId: item.tourId,
            });
            resolve(results);
          }
        }
        );
      })
    })
    promises.then((result) => {
      res.status(200).json(itemSuccess);
    }).catch((error) => {
      res.status(500).json(error.message);
    })
};

const cancelTicket = (req, res) => {
  const { items, userId} = req.body;
  const promises = new Promise((resolve, reject) => {
    items.forEach(item => {
      pool.query(
        "CALL P_CancelTicket($1, $2, $3);",
        [item.bookedTourId, userId, item.tourId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
        );
      })
    })
    promises.then((result) => {
      console.log(result);
      res.status(200).json("success");
    }).catch((error) => {
      res.status(500).json(error.message);
    })
};

const touristInfo = (request, response) => {
  const { bookedTourId } = request.body;
  pool.query(
    "SELECT * FROM F_InitiateTourist($1)",
    [bookedTourId],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("error");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

/**
 * To redirect users to Stripe
 */
const getStripePage = async (req, res) => {
  res.send(checkoutHtmlPage(process.env.STRIPE_PUBLIC_KEY, req.query.sessionId));
};

const paySuccess = (req, res) => {
   
  /**
   * Don't fulfill the purchase here. Rather use Webhooks to fulfill purchase.
   */
  if(req.query.platform === 'web') {
    res.send(checkoutSuccessHtmlPage());
  }
  else
    res.json({success: true});
};

const payCancel = (req, res) => {
  if(req.query.platform === 'web') {
    res.send(checkoutCanceledHtmlPage());
  }
  else
    res.json({success: false});
}

const sendTicket = async (request, response) => {
  const { items, email, firstName, lastName } = request.body;
  console.log(items);
  const fullname = firstName + " " + lastName;
  items.forEach(async item => {
    let img = await QRCode.toDataURL(item.bookedTourId);
    const content = parse(process.env.SEND_TICKET_CONTENT,
      fullname,
      item.bookedTourId,
      item.tourName,
      new Date(item.timeStart).toString(),
      item.departureLocation,
      item.count,
      img,
      process.env.EMAIL
    );
    sendEmail("viBOTour Ticket", content, email)
  })
  response.status(200).json("success");
};

export { payTour, saveTicket, cancelTicket, touristInfo, getStripePage, paySuccess, payCancel, checkout, sendTicket };
