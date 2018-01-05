module.exports = (req, res) => {
  let url = process.env.REDIRECT_URL;
  if (req.get('host').includes('try-react-staging')) {
    url = url.replace('try-react', 'try-react-staging');
  }
  res.redirect(301, url + req.originalUrl);
};
