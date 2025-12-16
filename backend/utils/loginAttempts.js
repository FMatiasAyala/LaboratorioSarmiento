const attempts = new Map();

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 10 * 60 * 1000; // 10 min

exports.checkAttempts = (key) => {
  const data = attempts.get(key);
  if (!data) return null;

  if (data.blockUntil && Date.now() < data.blockUntil) {
    return true; // bloqueado
  }

  return false;
};

exports.registerFail = (key) => {
  const data = attempts.get(key) || { count: 0 };
  data.count++;

  if (data.count >= MAX_ATTEMPTS) {
    data.blockUntil = Date.now() + BLOCK_TIME;
  }

  attempts.set(key, data);
};

exports.clearAttempts = (key) => {
  attempts.delete(key);
};
