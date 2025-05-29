import { Router } from 'express';
import { QuoteRequestController } from '../controllers/quote-request.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';
import { Quote } from '../models/quote.model';

const router = Router();
const controller = new QuoteRequestController();

// Submit a new quote request (public endpoint with optional auth)
router.post('/quote-requests', optionalAuthMiddleware, controller.submitQuoteRequest);

// Get all quote requests (requires authentication)
router.get('/quote-requests', authMiddleware, controller.getQuoteRequests);

// Update a quote request (requires authentication)
router.patch('/quote-requests/:id', authMiddleware, controller.updateQuoteRequest);

// Debug route - remove in production
router.get('/debug/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find().lean();
    const collections = await Quote.db.db.listCollections().toArray();
    res.json({
      quotesCount: quotes.length,
      quotes: quotes,
      collections: collections.map(c => c.name),
      currentCollection: Quote.collection.name
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DEV ONLY - Easy database cleanup through browser
router.get('/dev/cleanup', async (req, res) => {
  try {
    // Simple HTML response
    if (!req.query.confirm) {
      res.send(`
        <html>
          <body style="padding: 20px; font-family: Arial, sans-serif;">
            <h1>⚠️ Database Cleanup</h1>
            <p>This will delete all quotes from the database.</p>
            <p>Current quote count: <strong>${await Quote.countDocuments()}</strong></p>
            <button onclick="if(confirm('Are you sure you want to delete all quotes?')) window.location.href='?confirm=true'" style="padding: 10px 20px; background-color: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Delete All Quotes
            </button>
          </body>
        </html>
      `);
      return;
    }

    // Perform the deletion
    const result = await Quote.deleteMany({});
    res.send(`
      <html>
        <body style="padding: 20px; font-family: Arial, sans-serif;">
          <h1>✅ Database Cleaned</h1>
          <p>Successfully deleted ${result.deletedCount} quotes.</p>
          <p><a href="/api/dev/cleanup">Go back</a></p>
        </body>
      </html>
    `);
  } catch (error: any) {
    res.status(500).send(`
      <html>
        <body style="padding: 20px; font-family: Arial, sans-serif;">
          <h1>❌ Error</h1>
          <p>Failed to clean database: ${error.message}</p>
          <p><a href="/api/dev/cleanup">Try again</a></p>
        </body>
      </html>
    `);
  }
});

// Admin cleanup route - USE WITH CAUTION
router.post('/admin/cleanup', authMiddleware, async (req, res) => {
  try {
    const { action, confirmationCode } = req.body;
    
    // Simple safety check
    if (action !== 'DELETE_ALL_QUOTES' || confirmationCode !== 'CONFIRM_DELETE_ALL_QUOTES') {
      return res.status(400).json({ 
        error: 'Invalid action or confirmation code',
        message: 'To delete all quotes, send: { "action": "DELETE_ALL_QUOTES", "confirmationCode": "CONFIRM_DELETE_ALL_QUOTES" }'
      });
    }

    const result = await Quote.deleteMany({});
    res.json({ 
      message: 'Database cleaned up successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 