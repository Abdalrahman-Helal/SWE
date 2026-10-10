import { deleteBannerImageFromCloundinary } from "../lib/cloundinary.js";
import { logger } from "../lib/logger.js";
import { bullmqConnection } from "../lib/redis.js";
import { Worker } from "bullmq";

const QUEUE_NAME = "cloudinary-jobs";
const DELETE_CLOUDINARY_IMAGE_JOB_NAME = "delete-cloudinary-image";

type DeleteCloudinaryImageJobData = {
  publicId: string;
};

export const deleteCloudinaryImageWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name !== DELETE_CLOUDINARY_IMAGE_JOB_NAME) {
      throw new Error("Invalid job name");
    }

    const data = job.data as DeleteCloudinaryImageJobData;
    await deleteBannerImageFromCloundinary(data.publicId);
  },
  {
    connection: bullmqConnection,
  },
);

deleteCloudinaryImageWorker.on("completed", (job) => {
  logger.info(`Cloundinary delete job completed ${job.id}`)
});

deleteCloudinaryImageWorker.on("failed", (job, err) => {
  logger.error(
    {
      err, jobId: job?.id
    },
    'Cloundinary delete job failed'
  )
})

logger.info("Delete Cloudinary Image Worker started");
