import { Request, Response } from 'express';
import { Quote } from '../models/quote.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { QuoteManager } from '../pricing/quote-manager';

export class QuoteRequestController {
  private quoteManager = new QuoteManager();

  submitQuoteRequest = async (req: Request, res: Response) => {
    try {
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

      // Create the quote with status 'Pending'
      const quote = new Quote({
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
      // Only authenticated users can view all quotes
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      console.log('User requesting quotes:', req.user);

      // First, let's check what's in the database
      const totalCount = await Quote.countDocuments();
      console.log('Total quotes in database:', totalCount);

      // Get all quotes without any filtering or pagination first
      const quotes = await Quote.find()
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

      // Ensure only valid fields are updated
      const allowedUpdates = [
        'status',
        'note',
        'estimatedPrice',
        'parameters'
      ];

      const sanitizedUpdate = Object.keys(update).reduce((acc, key) => {
        if (allowedUpdates.includes(key)) {
          acc[key] = update[key];
        }
        return acc;
      }, {} as Record<string, any>);

      const quote = await Quote.findByIdAndUpdate(
        id,
        sanitizedUpdate,
        { new: true, runValidators: true }
      ).lean();

      if (!quote) {
        return res.status(404).json({ error: 'Quote request not found' });
      }

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

      res.json(transformedQuote);
    } catch (error: any) {
      console.error('Error updating quote request:', error);
      res.status(500).json({ error: error.message || 'Failed to update quote request' });
    }
  };
} 