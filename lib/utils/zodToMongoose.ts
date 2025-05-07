import { z } from "zod";
import mongoose from "mongoose";

/**
 * Converts a Zod schema to a Mongoose schema definition
 * @param zodSchema The Zod schema to convert
 * @returns A Mongoose schema configuration object
 */
export function zodToMongoose(zodSchema: z.ZodType) {
  const shape = getZodShape(zodSchema);
  const mongooseSchema = {};

  Object.entries(shape).forEach(([key, zodType]) => {
    mongooseSchema[key] = convertZodTypeToMongoose(zodType);
  });

  return mongooseSchema;
}

function getZodShape(schema: z.ZodType): Record<string, z.ZodType> {
  if (schema instanceof z.ZodObject) {
    return schema._def.shape();
  }
  if (schema instanceof z.ZodEffects) {
    return getZodShape(schema.innerType());
  }
  throw new Error('Unsupported schema type for Mongoose conversion');
}

function convertZodTypeToMongoose(zodType: z.ZodType) {
  if (zodType instanceof z.ZodString) {
    return { type: String, required: true };
  }
  if (zodType instanceof z.ZodNumber) {
    return { type: Number, required: true };
  }
  if (zodType instanceof z.ZodBoolean) {
    return { type: Boolean, required: true };
  }
  if (zodType instanceof z.ZodDate) {
    return { type: Date, required: true };
  }
  if (zodType instanceof z.ZodArray) {
    const elementType = convertZodTypeToMongoose(zodType._def.type);
    const { required, ...restType } = elementType;
    return [restType];
  }
  if (zodType instanceof z.ZodObject) {
    const nestedSchema = {};
    const shape = getZodShape(zodType);
    Object.entries(shape).forEach(([key, type]) => {
      nestedSchema[key] = convertZodTypeToMongoose(type);
    });
    return nestedSchema;
  }
  if (zodType instanceof z.ZodEnum) {
    return { 
      type: String, 
      enum: zodType._def.values,
      required: true
    };
  }
  if (zodType instanceof z.ZodOptional) {
    const innerType = convertZodTypeToMongoose(zodType.unwrap());
    const { required, ...restType } = innerType;
    return restType;
  }
  if (zodType instanceof z.ZodDefault) {
    const unwrappedType = convertZodTypeToMongoose(zodType.removeDefault());
    const defaultValue = zodType._def.defaultValue();
    const { required, ...restType } = unwrappedType;
    return {
      ...restType,
      default: defaultValue
    };
  }
  if (zodType instanceof z.ZodEffects) {
    return convertZodTypeToMongoose(zodType.innerType());
  }
  if (zodType instanceof z.ZodNullable) {
    const innerType = convertZodTypeToMongoose(zodType.unwrap());
    const { required, ...restType } = innerType;
    return restType;
  }

  return { type: mongoose.Schema.Types.Mixed };
}
