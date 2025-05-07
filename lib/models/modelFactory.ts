import mongoose from "mongoose";
import { z } from "zod";
import { zodToMongoose } from "../utils/zodToMongoose";

/**
 * Creates a Mongoose model from a Zod schema
 * @param modelName The name of the Mongoose model
 * @param zodSchema The Zod schema to use for the model
 * @param options Optional Mongoose schema options
 * @returns A Mongoose model
 */
export function createModel<T extends z.ZodType>(
  modelName: string,
  zodSchema: T,
  options: mongoose.SchemaOptions = {},
  schemaExtend?: (schema: mongoose.Schema) => void
) {
  try {
    // Convert Zod schema to Mongoose schema configuration
    const schemaDefinition = zodToMongoose(zodSchema);
    
    // Create Mongoose schema
    const mongooseSchema = new mongoose.Schema(schemaDefinition, {
      timestamps: true, // Adds createdAt and updatedAt fields
      ...options
    });
    
    // Apply schema extensions if provided
    if (schemaExtend) {
      schemaExtend(mongooseSchema);
    }
    
    // Only create the model if it doesn't already exist
    return mongoose.models[modelName] || mongoose.model(modelName, mongooseSchema);
  } catch (error) {
    console.error(`Error creating model ${modelName}:`, error);
    throw error;
  }
}
