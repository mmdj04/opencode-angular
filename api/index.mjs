import { reqHandler } from '../dist/opencode-angular/server/server.mjs';

export default async function handler(req, res) {
  return reqHandler(req, res);
}

export const config = {
  api: false,
};
