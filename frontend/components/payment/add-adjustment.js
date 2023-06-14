import React, { useState } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { RiseLoader } from 'react-spinners';
import { addAdjustmentApi } from '@/api/visit-api';
import { Icon } from '@/components/_commom/Icon';

import { paymentReceivers } from '@/data/paymentOptions';

function AddAdjustment({ show, setShow, visitId, setRefresh, session }) {
  const [paymentRecord, setPaymentRecord] = useState({
    paymentMethod: 'Adjustment',
    visitId: visitId,
    paymentReceiver: 'Check-out',
    userId: session.user.id,
  });
  const [submissionState, setSubmissionState] = useState('idle');

  const handleSubmit = async () => {
    if (!paymentRecord.paymentNotes) {
      setSubmissionState('error');
      setTimeout(() => {
        setSubmissionState('idle');
      }, 2000);
      return false;
    }
    setSubmissionState('loading');
    const apiResult = await addAdjustmentApi(paymentRecord);
    if (apiResult) {
      setSubmissionState('success');
      setPaymentRecord({
        paymentMethod: 'Cash',
        visitId: visitId,
        paymentReceiver: 'Check-out',
        userId: session.user.id,
      });
      setSubmissionState('idle');
      setRefresh(true);
      setShow(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}
      size="xl">
      <Modal.Header closeButton className="py-1">
        <h4>Please enter adjustment details</h4>
      </Modal.Header>
      <Modal.Body>
        <Row className="mx-0 my-1 py-2 custom-form arrow-hidden">
          <Col xs={6} md={3} className="fw-bold">
            Adjustment amount (BDT)
          </Col>
          <Col xs={6} md={3} className="fw-bold text-end">
            <input
              // type="number"
              // step=".01"
              type="text"
              pattern="^\d*(\.\d{0,2})?$"
              // min={0}
              value={paymentRecord.amount || 0}
              onChange={(e) =>
                setPaymentRecord({ ...paymentRecord, amount: e.target.value })
              }
            />
          </Col>
          <div />

          <Col xs={6}>
            <label for="paymentMethod" className="mt-3">
              Adjustment by
            </label>
            <select
              name="paymentreceiver"
              id="paymentreceiver"
              onChange={(e) =>
                setPaymentRecord({
                  ...paymentRecord,
                  paymentReceiver: e.target.value,
                })
              }>
              {paymentReceivers.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </Col>

          <Col md={12}>
            <label for="paymentNotes" className="mt-3">
              Adjustment Notes
            </label>
            <textarea
              rows={2}
              placeholder="Adjustment justification"
              name="paymentNotes"
              id="paymentNotes"
              onChange={(e) =>
                setPaymentRecord({
                  ...paymentRecord,
                  paymentNotes: e.target.value,
                })
              }
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-center mt-5 mb-3">
          <div className="mx-1">
            <ReactiveButton
              buttonState={submissionState}
              onClick={handleSubmit}
              color={'blue'}
              idleText={'Submit'}
              loadingText={
                <RiseLoader color="#ffffff" size={5} speedMultiplier={2} />
              }
              successText={
                <span className="d-flex justify-content-center">
                  <Icon nameIcon="FaRegThumbsUp" />
                </span>
              }
              errorText={<span className="text-danger">Enter Note</span>}
              type={'button'}
              className="rounded-1 bg-gradient"
              messageDuration={2000}
              animation={true}
            />
          </div>

          {submissionState === 'idle' ? (
            <div className="mx-1">
              <ReactiveButton
                buttonState="idle"
                onClick={() => {
                  setPaymentRecord({
                    paymentMethod: 'Cash',
                    visitId: visitId,
                    paymentReceiver: 'Check-out',
                    userId: session.user.id,
                  });
                  setShow(false);
                }}
                color={'red'}
                idleText={'Cancel'}
                type={'button'}
                className="rounded-1 bg-gradient"
                animation={true}
              />
            </div>
          ) : (
            <div>&nbsp;</div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddAdjustment;
