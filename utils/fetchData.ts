import axios from 'axios';

//Post api
export const postData = async (url: string, body: any, token: string | undefined = '') => {
  return await axios
    .post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      withCredentials: true,
    })
    .then((data) => {
      return data.data;
    });
};

//Put api
export const putData = async (url: string, body: any, token: string | undefined = '') => {
  return await axios
    .put(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      withCredentials: true,
    })
    .then((data) => {
      return data.data;
    });
};

//Get api
export const getData = async (url: string, token: string | undefined = '') => {
  return await axios
    .get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      withCredentials: true,
    })
    .then((data) => {
      return data.data;
    });
};

//Delete api
export const deleteData = async (url: string, token: string | undefined = '') => {
  return await axios
    .get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      withCredentials: true,
    })
    .then((data) => {
      return data.data;
    });
};
