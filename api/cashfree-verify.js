// Vercel Serverless Function: Verifies Cashfree Order payment status server-side

export default async function handler(req, res) {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const envMode = (process.env.CASHFREE_ENV || 'production').toLowerCase() === 'sandbox' ? 'sandbox' : 'production';

  if (!appId || !secretKey) {
    return res.status(200).json({ paid: false, error: 'Cashfree not configured' });
  }

  const orderId = req.query?.order_id || req.body?.order_id;
  if (!orderId) {
    return res.status(400).json({ paid: false, error: 'Missing order_id' });
  }

  const baseUrl = envMode === 'sandbox'
    ? `https://sandbox.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`
    : `https://api.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`;

  try {
    const cfRes = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secretKey
      }
    });
    const data = await cfRes.json();
    const isPaid = data?.order_status === 'PAID';
    return res.status(200).json({
      paid: isPaid,
      order_status: data?.order_status || 'UNKNOWN',
      order_amount: data?.order_amount
    });
  } catch (err) {
    return res.status(500).json({ paid: false, error: err?.message || 'Verification failed' });
  }
}
