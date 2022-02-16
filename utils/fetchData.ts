import axios from 'axios';
import { IPropsFetchData } from '../models';

//Config default axios
axios.defaults.withCredentials = true;

//Post api
export const postData = async ({ url, body, token = '' }: IPropsFetchData) => {
  return await axios
    .post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
    .then((data) => {
      return data.data;
    });
};

//Put api
export const putData = async ({ url, body, token = '' }: IPropsFetchData) => {
  return await axios
    .put(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }) 
    .then((result) => {
      return result.data;
    });
};

//Get api
export const getData = async ({ url, token = '' }: IPropsFetchData) => {
  return await axios
    .get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
    .then((result) => {
      return result.data;
    });
};

//Delete api
export const deleteData = async ({ url, token = '' }: IPropsFetchData) => {
  return await axios
    .delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
    .then((result) => {
      return result.data;
    });
};
