import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Checkpoint model — stores portfolio snapshots in their own isolated MongoDB collection.
 *
 * DESIGN DECISION: Checkpoints are NEVER part of PortfolioData.
 * This prevents a circular problem where restoring a checkpoint would overwrite
 * the checkpoint list itself with a stale/empty version.
 *
 * Primary storage: localStorage (fast, zero-latency for admin UX)
 * Secondary storage: this MongoDB collection (allows cross-device recovery)
 */

// Sub-schema for a single checkpoint snapshot (data is stored as raw Mixed)
const CheckpointEntrySchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, default: 'Unnamed Checkpoint' },
    timestamp: { type: String, required: true },
    // Portfolio data snapshot stored as flexible mixed type
    // so schema changes to Portfolio do not break existing checkpoints
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

export interface ICheckpointDocument extends Document {
  // A single document per portfolio (singleton pattern)
  checkpoints: Array<{
    id: string;
    name: string;
    timestamp: string;
    data: unknown;
  }>;
  updatedAt: Date;
}

const CheckpointSchema = new Schema<ICheckpointDocument>(
  {
    checkpoints: { type: [CheckpointEntrySchema], default: [] },
  },
  { timestamps: true },
);

const CheckPoint: Model<ICheckpointDocument> =
  mongoose.models.CheckPoint ||
  mongoose.model<ICheckpointDocument>('CheckPoint', CheckpointSchema);

export default CheckPoint;
