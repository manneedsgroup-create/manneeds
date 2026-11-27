// Vercel Serverless Function: Creates a Cashfree PG v3 Order & payment_session_id
// Required Vercel Environment Variables:
//   CASHFREE_APP_ID
//   CASHFREE_SECRET_KEY
//   CASHFREE_ENV = "production" (or "sandbox" for testing)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const envMode = (process.env.CASHFREE_ENV || 'production').toLowerCase() === 'sandbox' ? 'sandbox' : 'production';

  if (!appId || !secretKey) {
    return res.status(200).json({
      configured: false,
      error: 'Cashfree API keys (CASHFREE_APP_ID & CASHFREE_SECRET_KEY) are not configured in Vercel yet.'
    });
  }

  const baseUrl = envMode === 'sandbox'
    ? 'https://sandbox.cashfree.com/pg/orders'
    : 'https://api.cashfree.com/pg/orders';

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const amount = Number(body.amount);
    const customerName = String(body.customer_name || 'ManNeeds Customer').trim();
    const customerPhone = String(body.customer_phone || '').replace(/\D/g, '').slice(-10);
    const customerEmail = String(body.customer_email || `${customerPhone || 'guest'}@manneeds.in`).trim();
    const orderId = String(body.order_id || `MN_${Date.now()}`).replace(/[^A-Za-z0-9_-]/g, '');

    if (!amount || amount <= 0 || !customerPhone) {
      return res.status(400).json({ configured: true, error: 'Valid amount and 10-digit phone number are required.' });
    }

    const origin = req.headers.origin || `https://${req.headers.host || 'manneeds.in'}`;

    const cfRes = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secretKey
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: Number(amount.toFixed(2)),
        order_currency: 'INR',
        customer_details: {
          customer_id: `cust_${customerPhone}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone
        },
        order_meta: {
          return_url: `${origin}/?cf_order_id={order_id}`
        },
        order_note: 'ManNeeds Pure Kitchen Essentials Order'
      })
    });

    const data = await cfRes.json();
    if (!cfRes.ok || !data.payment_session_id) {
      return res.status(200).json({
        configured: true,
        error: data.message || 'Could not create Cashfree payment session.'
      });
    }

    return res.status(200).json({
      configured: true,
      env: envMode,
      order_id: data.order_id,
      payment_session_id: data.payment_session_id
    });
  } catch (err) {
    return res.status(500).json({
      configured: true,
      error: err?.message || 'Cashfree server error'
    });
  }
}
