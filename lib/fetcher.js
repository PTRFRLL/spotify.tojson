export default async function(input, init) {
    const res = await fetch(input, init);
    return res.json();
  }