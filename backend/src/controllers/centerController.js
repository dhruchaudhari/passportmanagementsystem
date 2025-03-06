import { Center } from "../models/center.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new passport center
// export const createCenter = async (req, res, next) => {
//   try {
//     const { centername, location } = req.body;
//     const existingCenter = await Center.findOne({ centername });

//     if (existingCenter) {
//       return next(new ApiError(400, "Center with this name already exists"));
//     }

//     const newCenter = new Center({ centername, location, slots: [] });
//     await newCenter.save();

//     res.status(201).json(new ApiResponse(201, newCenter, "Center created successfully"));
//   } catch (error) {
//     next(new ApiError(500, "Internal Server Error"));
//   }
// };

// Get all centers
// export const getCenters = async (req, res, next) => {
//   try {
//     const centers = await Center.find();
//     res.status(200).json(new ApiResponse(200, centers, "Centers retrieved successfully"));
//   } catch (error) {
//     next(new ApiError(500, "Internal Server Error"));
//   }
// };

// // Get a specific center by ID
// export const getCenterById = async (req, res, next) => {
//   try {
//     const center = await Center.findById(req.params.id);
//     if (!center) {
//       return next(new ApiError(404, "Center not found"));
//     }

//     res.status(200).json(new ApiResponse(200, center, "Center details fetched successfully"));
//   } catch (error) {
//     next(new ApiError(500, "Internal Server Error"));
//   }
// };

// // Add slots to a center
// export const addSlot = async (req, res, next) => {
//   try {
//     const { date, remainingslots } = req.body;
//     const center = await Center.findById(req.params.id);

//     if (!center) {
//       return next(new ApiError(404, "Center not found"));
//     }

//     center.slots.push({ date, remainingslots });
//     await center.save();

//     res.status(201).json(new ApiResponse(201, center, "Slot added successfully"));
//   } catch (error) {
//     next(new ApiError(500, "Internal Server Error"));
//   }
// };

// // Get slots for a specific center
// export const getSlotsByCenter = async (req, res, next) => {
//   try {
//     const center = await Center.findById(req.params.id);
//     if (!center) {
//       return next(new ApiError(404, "Center not found"));
//     }

//     res.status(200).json(new ApiResponse(200, center.slots, "Slots retrieved successfully"));
//   } catch (error) {
//     next(new ApiError(500, "Internal Server Error"));
//   }
// };

// export const checkAvailibilty = async (req, res, next) => {
//   try {
//       const { centerId, visitDate } = req.body;
//       const selectedDate = new Date(visitDate);
//       const day = selectedDate.getDay();
      
//       if (day === 6 || day === 0) {
//           return next(new ApiError(400, "Weekends are not allowed. Please select a weekday."));
//       }

//       let center = await Center.findById(centerId);
//       if (!center) {
//           return next(new ApiError(404, "Center not found"));
//       }

//       let slot = center.slots.find(s => s.date.toISOString().split('T')[0] === visitDate);
//       if (!slot) {
//           slot = { date: visitDate, remainingslots: 10 }; // Default slot count
//           center.slots.push(slot);
//           await center.save();
//       }

//       if (slot.remainingslots > 0) {
//           return res.json(new ApiResponse(200, "Slot available", { available: true }));
//       } else {
//           return res.json(new ApiResponse(200, "No slots available", { available: false }));
//       }
//   } catch (error) {
//       next(new ApiError(500, "Internal Server Error"));
//   }
// }

// // Deduct a slot from a center for a specific date
// export const deductSlot = async (req, res, next) => {
//   try {
//     const { centerId, visitDate } = req.body;

//     if (!centerId || !visitDate) {
//       return next(new ApiError(400, "Center ID and visit date are required"));
//     }

//     const center = await Center.findOneAndUpdate(
//       {
//         _id: centerId,
//         "slots.date": formattedDate, // Match the correct slot date
//       },
//       {
//         $inc: { "slots.$.remainingslots": -1 }, // Decrease slot count
//       },
//       { new: true } // Return updated document
//     );

//     if (!center) {
//       throw new Error("Slot not found or Center not found");
//     }

//     return { success: true, message: "Slot deducted successfully", center };

//     res.status(200).json(new ApiResponse(200, center, "Slot deducted successfully"));
//   } catch (error) {
//     next(new ApiError(500, "Internal Server Error"));
//   }
// };



export const createCenter = async (req, res, next) => {
  try {
    const { centername, location } = req.body;
    const existingCenter = await Center.findOne({ centername });

    if (existingCenter) {
      return next(new ApiError(400, "Center with this name already exists"));
    }

    const newCenter = new Center({ centername, location, slots: new Map() });
    await newCenter.save();

    res.status(201).json(new ApiResponse(201, newCenter, "Center created successfully"));
  } catch (error) {
    next(new ApiError(500, "Internal Server Error"));
  }
};


export const getCenters = async (req, res, next) => {
  try {
    const centers = await Center.find();
    res.status(200).json(new ApiResponse(200, centers, "Centers retrieved successfully"));
  } catch (error) {
    next(new ApiError(500, "Internal Server Error"));
  }
};


export const getCenterById = async (req, res, next) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return next(new ApiError(404, "Center not found"));
    }

    res.status(200).json(new ApiResponse(200, center, "Center details fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Internal Server Error"));
  }
};


export const addSlot = async (req, res, next) => {
  try {
    const { date, remainingslots } = req.body;
    const center = await Center.findById(req.params.id);

    if (!center) {
      return next(new ApiError(404, "Center not found"));
    }

    // Convert date to a string (e.g., "2025-02-21")
    const formattedDate = new Date(date).toISOString().split("T")[0];

    // Add or update the slot
    center.slots.set(formattedDate, remainingslots);
    await center.save();

    res.status(201).json(new ApiResponse(201, center, "Slot added successfully"));
  } catch (error) {
    console.error("🔥 Error in addSlot:", error);
    next(new ApiError(500, "Internal Server Error"));
  }
};


export const getSlotsByCenter = async (req, res, next) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return next(new ApiError(404, "Center not found"));
    }

    const slots = center.slots instanceof Map ? center.slots : new Map();

    // Convert the slots Map to an array of objects
    const slotsArray = Array.from(slots.entries()).map(([date, remainingslots]) => ({
      date,
      remainingslots,
    }));

    res.status(200).json(new ApiResponse(200, slotsArray, "Slots retrieved successfully"));
  } catch (error) {

    next(new ApiError(500, "Internal Server Error"));
  }
};


export const checkAvailability = async (req, res, next) => {
  try {
    const { centerId, visitDate } = req.body;
    const selectedDate = new Date(visitDate);
    const day = selectedDate.getDay();

    if (day === 6 || day === 0) {
      return next(new ApiError(400, "Weekends are not allowed. Please select a weekday."));
    }

    const center = await Center.findById(centerId);
    if (!center) {
      return next(new ApiError(404, "Center not found"));
    }

    // Convert visitDate to a string (e.g., "2025-02-21")
    const formattedDate = selectedDate.toISOString().split("T")[0];

    // Check if a slot exists for the selected date
    const remainingslots = center.slots.get(formattedDate) || 10; // Default to 10 if no slot exists

    if (remainingslots > 0) {
      return res.json(new ApiResponse(200, "Slot available", { available: true }));
    } else {
      return res.json(new ApiResponse(200, "No slots available", { available: false }));
    }
  } catch (error) {
    next(new ApiError(500, "Internal Server Error"));
  }
};


export const deductSlot = async (req, res, next) => {
  try {
    const { centerId, visitDate } = req.body;

    if (!centerId || !visitDate) {
      return next(new ApiError(400, "Center ID and visit date are required"));
    }

    const center = await Center.findById(centerId);
    if (!center) {
      return next(new ApiError(404, "Center not found"));
    }

    // Convert visitDate to a string (e.g., "2025-02-21")
    const formattedDate = new Date(visitDate).toISOString().split("T")[0];

    // Check if a slot exists for the selected date
    if (center.slots.has(formattedDate)) {
      const remainingslots = center.slots.get(formattedDate);

      if (remainingslots <= 0) {
        return next(new ApiError(400, "No remaining slots available"));
      }

      // Decrement the remaining slots
      center.slots.set(formattedDate, remainingslots - 1);
    } else {
      // If no slot exists, create a new one with default slots minus 1
      center.slots.set(formattedDate, 9); // Default slots minus 1
    }

    await center.save();

    res.status(200).json(new ApiResponse(200, center, "Slot deducted successfully"));
  } catch (error) {
    next(new ApiError(500, "Internal Server Error"));
  }
};