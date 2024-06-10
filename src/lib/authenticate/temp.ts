export const temp = () => {
  return fetch("http://localhost:3000/lib/server", {
    method: "POST",
  });
};
