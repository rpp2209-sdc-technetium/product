import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s',
  rps: 1000,
};

export default function () {
  http.get('http://localhost:3000/products/1/related');
  sleep(1);
}