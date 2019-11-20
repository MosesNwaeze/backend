/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
const pool = require('../models/db');


module.exports = (req, res) => {
  let processedResult = [];
  let counter = 0;
  const query1 = 'SELECT * FROM public.articles UNION SELECT * FROM public.gifs ORDER BY createdon asc';
  const query2 = 'INSERT INTO public.feeds (createdon, title, authorid, body) values($1, $2, $3, $4)';

  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
    client.query(query1, (err, results) => {
      done();
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const { rows } = results;
      processedResult = rows;
      // console.log(processedResult);
    });
  });

  pool.connect((error, client, done) => {
    if (error) {
      done();
      console.log(error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
    const response = [];
    processedResult.forEach((e) => {
      response.push({
        id: ++counter,
        createdon: e.createdon,
        title: e.title,
        body: e.body,
        authorId: e.id,
      });
      client.query(query2, [e.createdon, e.title, e.id, e.body], (err) => {
        if (err) {
          done();
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    });
    res.status(200).json({ status: 'success', data: response });
  });
};
