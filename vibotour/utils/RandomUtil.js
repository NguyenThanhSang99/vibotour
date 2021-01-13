const createRandomId = () => {
  const now = new Date().getTime();
  return now * 1000 + +Math.floor(Math.random() * 1000);
};

export { createRandomId };
