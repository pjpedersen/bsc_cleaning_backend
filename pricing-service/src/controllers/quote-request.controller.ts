import { Request, Response } from 'express';
import { Quote } from '../models/quote.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { QuoteManager } from '../pricing/quote-manager';

export class QuoteRequestController {
  private quoteManager = new QuoteManager();

  submitQuoteRequest = async (req: AuthRequest, res: Response) => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const {
        customerType,
        name,
        email,
        phone,
        address,
        city,
        zip,
        note,
        service,
        estimatedPrice,
        parameters
      } = req.body;

      // Create the quote with status 'Pending' and user ID
      const quote = new Quote({
        userId: req.user.id,
        customerType,
        name,
        email,
        phone,
        address,
        city,
        zip,
        note,
        service,
        estimatedPrice,
        parameters,
        status: 'Pending'
      });

      await quote.save();

      // Return id instead of _id to match frontend expectations
      res.status(201).json({ 
        id: quote._id.toString()
      });
    } catch (error: any) {
      console.error('Error submitting quote request:', error);
      res.status(500).json({ error: error.message || 'Failed to submit quote request' });
    }
  };

  getQuoteRequests = async (req: AuthRequest, res: Response) => {
    try {
      // Only authenticated users can view quotes
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      console.log('User requesting quotes:', req.user);

      // Get quotes for the authenticated user
      const quotes = await Quote.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      // Transform the response to match frontend expectations
      const transformedQuotes = quotes.map(quote => ({
        id: quote._id.toString(),
        customerType: quote.customerType,
        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        address: quote.address,
        city: quote.city,
        zip: quote.zip,
        note: quote.note,
        service: quote.service,
        estimatedPrice: quote.estimatedPrice,
        parameters: quote.parameters,
        status: quote.status,
        createdAt: quote.createdAt,
      }));

      console.log('Sending transformed quotes:', {
        quotesCount: transformedQuotes.length,
        firstQuote: transformedQuotes[0]
      });

      // Send the transformed quotes
      res.json(transformedQuotes);
    } catch (error: any) {
      console.error('Error fetching quote requests:', error);
      console.error('Full error object:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch quote requests' });
    }
  };

  updateQuoteRequest = async (req: AuthRequest, res: Response) => {
    try {
      // Only authenticated users can update quotes
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { id } = req.params;
      const update = req.body;

      console.log('=== Quote Update Debug ===');
      console.log('1. Request body:', JSON.stringify(req.body, null, 2));
      console.log('2. Quote ID:', id);

      // First, find the quote and check ownership
      const existingQuote = await Quote.findById(id);
      if (!existingQuote) {
        return res.status(404).json({ error: 'Quote request not found' });
      }

      // Check if the user owns this quote
      if (existingQuote.userId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this quote' });
      }

      // Allow updating all customer-related fields
      const allowedUpdates = [
        'customerType',
        'name',
        'email',
        'phone',
        'address',
        'city',
        'zip',
        'note',
        'service',
        'estimatedPrice',
        'parameters',
        'status'
      ];

      const sanitizedUpdate = Object.keys(update).reduce((acc, key) => {
        if (allowedUpdates.includes(key)) {
          acc[key] = update[key];
        }
        return acc;
      }, {} as Record<string, any>);

      console.log('3. Sanitized update:', JSON.stringify(sanitizedUpdate, null, 2));

      // Get the quote before update
      const beforeQuote = await Quote.findById(id).lean();
      console.log('4. Quote before update:', JSON.stringify(beforeQuote, null, 2));

      const quote = await Quote.findByIdAndUpdate(
        id,
        sanitizedUpdate,
        { new: true, runValidators: true }
      ).lean();

      if (!quote) {
        return res.status(404).json({ error: 'Quote request not found' });
      }

      console.log('5. Quote after update:', JSON.stringify(quote, null, 2));

      // Transform the response to match frontend expectations
      const transformedQuote = {
        id: quote._id.toString(),
        customerType: quote.customerType,
        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        address: quote.address,
        city: quote.city,
        zip: quote.zip,
        note: quote.note,
        service: quote.service,
        estimatedPrice: quote.estimatedPrice,
        parameters: quote.parameters,
        status: quote.status,
        createdAt: quote.createdAt,
      };

      console.log('6. Transformed response:', JSON.stringify(transformedQuote, null, 2));
      console.log('=== End Debug ===');

      res.json(transformedQuote);
    } catch (error: any) {
      console.error('Error updating quote request:', error);
      res.status(500).json({ error: error.message || 'Failed to update quote request' });
    }
  };
} 