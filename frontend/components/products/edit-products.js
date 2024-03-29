import React from 'react';
import { Modal } from 'react-bootstrap';
import EditPackage from './edit/edit-package';
import { camelCaseToCapitalizedString } from '../_functions/string-format';
import EditPrixfixe from './edit/edit-prixfixe';
import EditAlacarte from './edit/edit-alacarte';
import EditRoom from './edit/edit-room';
import EditService from './edit/edit-service';
import EditRoomType from './edit/edit-room-type';
import EditVenue from './edit/edit-venue';

function EditProduct({
  show,
  setShow,
  productDetail,
  productType,
  setRefresh,
}) {
  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      size="xl"
      onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-bold">
          Edit {camelCaseToCapitalizedString(productType)}:{' '}
          {productType === 'room'
            ? productDetail?.roomtype?.room_type_name +
              '-' +
              productDetail.room_number
            : productType === 'roomtype' ? productDetail.room_type_name : productDetail.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(() => {
          switch (productType) {
            case 'package':
              return (
                <EditPackage
                  productDetail={productDetail}
                  isNew={false}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );

            case 'prixfixe':
              return (
                <EditPrixfixe
                  productDetail={productDetail}
                  isNew={false}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );

            case 'alacarte':
              return (
                <EditAlacarte
                  productDetail={productDetail}
                  isNew={false}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );

            case 'room':
              return (
                <EditRoom
                  productDetail={productDetail}
                  isNew={false}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );

              case 'venues':
                return (
                  <EditVenue
                    productDetail={productDetail}
                    isNew={false}
                    setRefresh={setRefresh}
                    setShow={setShow}
                  />
                );

                case 'roomtype':
                return (
                  <EditRoomType
                    productDetail={productDetail}
                    isNew={false}
                    setRefresh={setRefresh}
                    setShow={setShow}
                  />
                );
  
              case 'service':
              return (
                <EditService
                  productDetail={productDetail}
                  isNew={false}
                  setRefresh={setRefresh}
                  setShow={setShow}
                />
              );

            default:
              return <div className="error-message">Something went wrong</div>;
          }
        })()}
      </Modal.Body>
    </Modal>
  );
}

export default EditProduct;
