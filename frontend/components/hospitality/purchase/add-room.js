import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ReactiveButton from 'reactive-button';

import { Icon } from '@/components/_commom/Icon';
import { listAllRoomsApi } from '@/api/products-api';
import {
  roundUptoFixedDigits,
  sumOfKeyMultiply,
  updateStateArray,
} from '@/components/_functions/common-functions';
import { addPurchaseApi } from '@/api/visit-api';
import { paymentOptions, paymentReceivers } from '@/data/paymentOptions';
import PaymentForm from '@/components/payment/payment-form';

function AddRoom({ componentType, visitId, setRefresh, setShow, session }) {
  const [productList, setProductList] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [paymentRecord, setPaymentRecord] = useState({
    paymentMethod: 'Cash',
    visitId: visitId,
    paymentReceiver: 'Restaurant',
    userId: session.user.id,
  });

  useEffect(() => {
    const fetchPackageList = async () => {
      const allProductList = await listAllRoomsApi();
      const filteredExistingItems = allProductList.filter(
        (item) =>
          !purchaseItems.some((existingItem) => existingItem.id === item.id)
      );
      setProductList(
        filteredExistingItems.map((obj, index) => {
          return {
            ...obj,
            value: index,
            label: obj.roomtype?.room_type_name + '-' + obj.room_number,
          };
        })
      );
    };
    fetchPackageList();
  }, []);

  const handleSelect = (value) => {
    const newItem = {
      item_type: componentType,
      item_name: value.roomtype?.room_type_name + '-' + value.room_number,
      item_count: 1,
      unit_price: value.roomtype?.price,
      visit_id: visitId,
    };
    setPurchaseItems((currentData) => [...currentData, newItem]);
  };

  const handleDeleteItem = (index) => {
    setPurchaseItems(
      purchaseItems.filter((item, currentIndex) => currentIndex !== index)
    );
  };

  const handleSubmit = async () => {
    const apiResult = await addPurchaseApi(purchaseItems, paymentRecord);
    setRefresh(true);
    setShow(false);
  };

  const handleItemCountChange = (value, index, key) => {
    if (value >= 0)
      updateStateArray(index, key, value, setPurchaseItems, purchaseItems);
  };

  return (
    <div>
      {/* Dropdown element for all items */}
      <div className="pb-2">
        <label>Select room type</label>
        <Select
          options={productList}
          onChange={(value) => handleSelect(value)}
        />
      </div>
      <div className="border-bottom border-3 mt-4" />
      <Row className="m-0 p-0 py-1 border fw-bold text-muted">
        <Col sm={3}>Item Name</Col>
        <Col sm={2}>Count</Col>
        <Col sm={3} className="text-end">
          Unit Price (BDT)
        </Col>
        <Col sm={3} className="text-end">
          Price (BDT)
        </Col>
      </Row>
      {purchaseItems.map((purchaseItem, index) => (
        <Row
          key={index}
          className="m-0 p-0 py-1 border custom-form arrow-hidden">
          <Col sm={3}>{purchaseItem.item_name}</Col>
          <Col sm={2}>
            <div className="d-lg-flex align-items-start">
              <input
                type="number"
                min={0}
                value={purchaseItem.item_count}
                className="py-0"
                onChange={(e) =>
                  handleItemCountChange(e.target.value, index, 'item_count')
                }
              />
              <div className="d-flex">
                <div className="reactive-button-wauto mx-lg-1 me-1">
                  <ReactiveButton
                    buttonState="idle"
                    color="dark"
                    idleText="+"
                    className="px-2 py-0 w-auto shadow-sm"
                    onClick={() =>
                      handleItemCountChange(
                        Number(purchaseItem.item_count) + 1,
                        index,
                        'item_count'
                      )
                    }
                  />
                </div>
                <div className="reactive-button-wauto mx-lg-1 ms-1">
                  <ReactiveButton
                    buttonState="idle"
                    color="dark"
                    idleText="-"
                    className="px-2 py-0 w-auto shadow-sm"
                    onClick={() =>
                      handleItemCountChange(
                        Number(purchaseItem.item_count) - 1,
                        index,
                        'item_count'
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col sm={3} className="text-end text-muted">
            {roundUptoFixedDigits(purchaseItem.unit_price, 2)}
          </Col>
          <Col sm={3} className="text-end">
            {roundUptoFixedDigits(
              purchaseItem.unit_price * purchaseItem.item_count,
              2
            )}
          </Col>

          <Col md={1} xs={1}>
            <div className="circular-button-wrapper">
              <ReactiveButton
                buttonState="idle"
                rounded
                color="red"
                buttonType="filled"
                className="circular-button"
                idleText={
                  <Icon
                    nameIcon="FaTimesCircle"
                    propsIcon={{ size: 18, color: '#fff' }}
                  />
                }
                onClick={() => handleDeleteItem(index)}
              />
            </div>
          </Col>
        </Row>
      ))}

      {/* Total row */}
      <Row className="border-bottom border-top border-dark m-0">
        <Col xs={6} className="fw-bold">
          Total (BDT)
        </Col>
        <Col xs={5} className="fw-bold text-end">
          {roundUptoFixedDigits(
            sumOfKeyMultiply(purchaseItems, 'unit_price', 'item_count'),
            2
          )}
        </Col>
      </Row>

      {/* Payment */}
      <PaymentForm
        paymentRecord={paymentRecord}
        setPaymentRecord={setPaymentRecord}
      />

      {/* Submit button */}
      <div className="center-flex mt-3">
        <ReactiveButton
          buttonState="idle"
          idleText="Submit"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default AddRoom;
