
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";

// 1. Book Appointment (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, time, department, reason, notes } = req.body;

    if (!doctor || !appointmentDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "Please provide doctor, date, and reason",
      });
    }

    const selectedDoctor = await Doctor.findById(doctor);

    if (!selectedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      appointmentDate,
      time: time || "",
      department: department || "",
      reason,
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Get Patient Appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate("doctor", "name specialisation phone")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Get Doctor Appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
    })
      .populate("patient", "name phone age disease")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Approve Appointment (Doctor)
export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id,
      status: "Pending",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Pending appointment not found",
      });
    }

    appointment.status = "Approved";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment approved successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. Reject Appointment (Doctor)
export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id,
      status: "Pending",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Pending appointment not found",
      });
    }

    appointment.status = "Rejected";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment rejected successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 6. Cancel Appointment (Patient)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.status === "Completed" ||
      appointment.status === "Rejected" ||
      appointment.status === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "This appointment cannot be cancelled",
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// admin

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
          .populate("patient", "name email phone age")
          .populate("doctor", "name email phone specialisation");

    if(!appointments){
      return res.status(400).json({
        success : false,
        message : "Appointments not found"
      })
    }

    return res.status(200).json({
      success : false,
      appointments
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getAppointmentDetail = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
          .populate("patient", "name email phone age")
          .populate("doctor", "name email phone specialisation");
    if(!appointment){
      return res.status(400).json({
        success : false,
        message : "Appointment not found"
      })
    }

    return res.status(200).json({
      success : true,
      appointment
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getAppointmentByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const appointments = await Appointment.find({status})
          .populate("patient", "name email phone age")
          .populate("doctor", "name email phone specialisation");

    return res.status(200).json({
      success : true,
      appointments
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if(!appointment){
      return res.status(400).json({
        success : false,
        message : "Appointment not found"
      })
    }

    appointment.status = status;
    await appointment.save();

    return res.status(200).json({
      success : true,
      message : "Appointment status updated successfully",
      appointment
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if(!appointment){
      return res.status(400).json({
        success : false,
        message : "Appointment not found"
      })
    }

    return res.status(200).json({
      success : true,
      message : "Appointment deleted successfully"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}