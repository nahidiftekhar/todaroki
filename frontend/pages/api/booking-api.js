import axios from 'axios';
import { beConfig } from '@/configs/backend';
import { organizationConfigs } from '@/configs/organizationConfig';

export const listAllBookingApi = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/booking-management/list-all-booking`
  );
  return apiResult.data;
};

export const getSingleBookingApi = async (bookingId) => {
  const apiResult = await axios.get(
    `${beConfig.host}/booking-management/get-booking-record/${bookingId}`
  );
  return apiResult.data;
};

// Not used anymore
export const createBookingApi = async (visitData, productData) => {
  const {
    packageDetails,
    prixfixeDetails,
    alacarteDetails,
    roomDetails,
    serviceDetails,
  } = productData;

  const objectToSubmit = {
    guestId: productData.guestId,
    userId: productData.userId,
    checkInDate: visitData.checkInDate,
    checkOutDate: visitData.checkOutDate,
    adultCount: 0,
    kidsCount: 0,
    amount:
      (productData.totalPackageCost || 0) +
      (productData.totalPrixfixeCost || 0) +
      (productData.totalRoomCost || 0) +
      (productData.totalAlacarteCost || 0) +
      (productData.totalServiceCost || 0),
    currency: visitData.values,
    components: {
      packageDetails,
      prixfixeDetails,
      alacarteDetails,
      roomDetails,
      serviceDetails,
    },
    notes: visitData.notes,
  };

  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/create-booking`,
    objectToSubmit
  );

  return apiResult.data;
};

export const modifyBookingApi = async (bookingData, discountData) => {
  bookingData.amount = Object.values(bookingData?.price_components).reduce(
    (accumulator, { rackPrice }) => accumulator + Number(rackPrice),
    0
  );

  bookingData.discounted_amount = Object.values(
    bookingData?.price_components
  ).reduce(
    (accumulator, { priceAfterDiscount }) =>
      accumulator + Number(priceAfterDiscount),
    0
  );
  bookingData.requester_id = discountData?.requester_id;
  bookingData.discount_id = discountData?.id;
  bookingData.approver_id = discountData?.approver_id;
  bookingData.discount_notes = Object.values(bookingData?.price_components)
    .map((obj) => obj.discountNotes)
    .join('\n');

  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/edit-booking`,
    bookingData
  );
  return apiResult.data;
};

export const addBookingApi = async (bookingData, checkInDate, checkOutDate) => {
  bookingData.checkOutDate = checkOutDate.setHours(0, 0, 0, 0);
  bookingData.checkInDate = checkInDate.setHours(0, 0, 0, 0);
  bookingData.amount = Object.values(bookingData?.price_components).reduce(
    (accumulator, { rackPrice }) => accumulator + Number(rackPrice),
    0
  );

  bookingData.discounted_amount = Object.values(
    bookingData?.price_components
  ).reduce(
    (accumulator, { priceAfterDiscount }) =>
      accumulator + Number(priceAfterDiscount),
    0
  );
  bookingData.requester_id = bookingData.user_id;
  bookingData.approver_id = organizationConfigs.APPROVER_ID;
  bookingData.discount_notes = Object.values(bookingData?.price_components)
    .map((obj) => obj.discountNotes)
    .join('\n');

  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/create-booking`,
    bookingData
  );
  return apiResult.data;
};

export const getMaxDiscountSlab = async () => {
  const apiResult = await axios.get(
    `${beConfig.host}/booking-management/max-discount`
  );
  return apiResult.data;
};

export const createDiscountApi = async (discountData) => {
  const objectToSubmit = {
    percentageValue: discountData.discountPercentage,
    totalValue: discountData.priceBeforeDiscount,
    notes: discountData.notes,
    bookingId: discountData.bookingId,
    requesterId: discountData.userId,
    approverId: 1,
  };
  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/create-discount`,
    objectToSubmit
  );
  return apiResult.data;
};

export const approveDiscountApi = async (
  discountData,
  approvalStatus,
  approverComment,
  approverId
) => {
  const objectToSubmit = {
    discountId: discountData.id,
    bookingId: discountData.booking_id,
    approvedDiscount: discountData.total_discount,
    approvedPercentage:
      (discountData.total_discount * 100) / discountData.rack_price,
    notes:
      (discountData.discount_notes || '') +
      '\nApproverNotes: ' +
      approverComment,
    approverNotes: approverComment,
    approverId: approverId,
    approvalStatus: approvalStatus,
    discountedAmount:
      Number(discountData.rack_price) - Number(discountData.total_discount),
  };
  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/approve-discount`,
    objectToSubmit
  );
  return apiResult.data;
};

export const confirmAdvancedApi = async (advancedData) => {
  const objectToSubmit = {
    bookingId: advancedData.bookingId,
    advancedAmount: advancedData.advancedAmount,
    advancedNotes: advancedData.advancedNotes,
  };

  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/confirm-advanced`,
    objectToSubmit
  );
  return apiResult.data;
};

export const cancelBookingApi = async (bookingId, notes) => {
  const objectToSubmit = {
    bookingId: bookingId,
    notes: notes,
  };

  const apiResult = await axios.post(
    `${beConfig.host}/booking-management/cancel-booking`,
    objectToSubmit
  );
  return apiResult.data;
};

export const pendingApprovalRequestsApi = async (approverId) => {
  const apiResult = await axios.get(
    `${beConfig.host}/booking-management/pending-discount-requests/${approverId}`
  );
  return apiResult.data;
};
