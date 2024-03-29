import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Modal } from 'react-bootstrap';
import ReactiveButton from 'reactive-button';
import { datetimeStringToDate } from '@/components/_functions/string-format';
import { Icon } from '@/components/_commom/Icon';
import PrModal from '@/components/purchase/add-pr-modal';
import ProcessPr from '@/components/purchase/process-pr';
import { Export, downloadCSV } from '@/components/_functions/table-export';
import { PuffLoader } from 'react-spinners';

const ItemPurchase = ({ session }) => {
  const [allRequisitions, setAllRequisitions] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openProcessModal, setOpenProcessModal] = useState(false);
  const [requisitionStatus, setRequisitionStatus] = useState('pendingApproval');
  const [refresh, setRefresh] = useState(false);
  const [buttonState, setButtonState] = useState('idle');
  const [currentItem, setCurrentItem] = useState({});

  useEffect(() => {
    const fetchProductCategories = async () => {
      setButtonState('loading');
      const productCategories = await axios.post('/api/purchase/pr/list', {
        status: requisitionStatus,
      });
      setAllRequisitions(productCategories.data);
      setRefresh(false);
      setButtonState('idle');
    };
    fetchProductCategories();
  }, [requisitionStatus, refresh]);

  const headerResponsive = [
    {
      name: 'Sl',
      selector: (row, index) => index + 1,
      width: '50px',
    },
    {
      name: 'PR Date',
      selector: (row) => (
        <p className="smaller-label">{datetimeStringToDate(row.createdAt)}</p>
      ),
      grow: 1,
      wrap: true,
    },
    {
      name: 'Item Name',
      selector: (row) => row.product?.name,
      grow: 2,
      wrap: true,
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity + ' ' + row.product?.unit,
      grow: 1,
    },
    {
      name: 'Budget',
      selector: (row) => row.price,
      grow: 1,
    },
    {
      name: 'Cost',
      selector: (row) => row.actual_cost || '-',
      grow: 1,
    },
    {
      name: 'Notes',
      selector: (row) =>
        row.notes ? (
          <div>
            {row.notes.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line === 'null' ? '-' : line}
                <br />
              </React.Fragment>
            ))}
          </div>
        ) : (
          '-'
        ),
      wrap: true,
      grow: 2,
    },
    {
      name: 'Requested by',
      selector: (row) => (
        <div>
          <p className="my-1">{row.purchase_requester?.username}</p>
          <p className="smaller-label my-1">
            {row.purchase_requester?.usertype?.user_type}
          </p>
        </div>
      ),
      grow: 2,
      wrap: true,
    },
    {
      name: 'Approved by',
      selector: (row) =>
        row.purchase_approver ? (
          <div>
            <p className="my-1">{row.purchase_approver?.username}</p>
            <p className="smaller-label my-1">
              {row.purchase_approver?.usertype?.user_type}
            </p>
          </div>
        ) : (
          '-'
        ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="my-1 d-flex">
          <div className="reactive-button-wauto mx-1">
            <ReactiveButton
              buttonState="idle"
              idleText={<Icon nameIcon="FaEdit" propsIcon={{ size: 14 }} />}
              outline
              color="indigo"
              className="rounded-1 py-1 px-2"
              onClick={() => {
                setOpenProcessModal(true);
                setCurrentItem(row);
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const exportFileArray = allRequisitions.map((item) => {
    return {
      Date: `"${datetimeStringToDate(item.createdAt)}"` || '-',
      Item: `"${item.product?.name}"` || '-',
      Quantity: `"${item.quantity + ' ' + item.product?.unit}"` || '-',
      Budget: `"${item.price}"` || '-',
      Cost: `"${item.actual_cost}"` || '-',
      Notes: `"${item.notes}"` || '-',
      Requester: `"${item.purchase_requester?.username}"` || '-',
      'Requester Dept':
        `"${item.purchase_requester?.usertype?.user_type}"` || '-',
      Approver: `"${item.purchase_approver?.username}"` || '-',
      'Approver Dept':
        `"${item.purchase_approver?.usertype?.user_type}"` || '-',
    };
  });

  const paginationComponentOptions = {
    selectAllRowsItem: true,
  };

  const subHeaderComponent = () => {
    return (
      <div className="d-flex justify-content-between">
        <div className="mx-1 reactive-button-wauto">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText={
              <div>
                <div className="d-block d-md-none">
                  <Icon nameIcon="FaClock" propsIcon={{}} />
                </div>
                <div className="d-none d-md-block my-0 mx-1">Pending</div>
              </div>
            }
            loadingText={
              <div className="center-flex">
                <PuffLoader size={16} color="#fff" />
              </div>
            }
            onClick={() => {
              setRequisitionStatus('pendingApproval');
            }}
            disabled={requisitionStatus === 'pendingApproval' ? true : false}
          />
        </div>

        <div className="mx-1 reactive-button-wauto">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText={
              <div>
                <div className="d-block d-md-none">
                  <Icon nameIcon="FaCheckCircle" propsIcon={{}} />
                </div>
                <div className="d-none d-md-block my-0 mx-1">Approved</div>
              </div>
            }
            loadingText={
              <div className="center-flex">
                <PuffLoader size={16} color="#fff" />
              </div>
            }
            onClick={() => {
              setRequisitionStatus('approved');
            }}
            disabled={requisitionStatus === 'approved' ? true : false}
            className="mx-0"
          />
        </div>

        <div className="mx-1 reactive-button-wauto">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText={
              <div>
                <div className="d-block d-md-none">
                  <Icon nameIcon="FaTimesCircle" propsIcon={{}} />
                </div>
                <div className="d-none d-md-block my-0 mx-1">Rejected</div>
              </div>
            }
            loadingText={
              <div className="center-flex">
                <PuffLoader size={16} color="#fff" />
              </div>
            }
            onClick={() => {
              setRequisitionStatus('rejected');
            }}
            disabled={requisitionStatus === 'rejected' ? true : false}
          />
        </div>

        <div className="mx-1 reactive-button-wauto">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText={
              <div>
                <div className="d-block d-md-none">
                  <Icon
                    nameIcon="HiOutlineCurrencyBangladeshi"
                    propsIcon={{}}
                  />
                </div>
                <div className="d-none d-md-block my-0 mx-1">Released</div>
              </div>
            }
            loadingText={
              <div className="center-flex">
                <PuffLoader size={16} color="#fff" />
              </div>
            }
            onClick={() => {
              setRequisitionStatus('released');
            }}
            disabled={requisitionStatus === 'released' ? true : false}
          />
        </div>

        <div className="mx-1 reactive-button-wauto">
          <ReactiveButton
            buttonState={buttonState}
            color="secondary"
            idleText={
              <div>
                <div className="d-block d-md-none">
                  <Icon nameIcon="FaTag" propsIcon={{}} />
                </div>
                <div className="d-none d-md-block my-0 mx-1">Purchased</div>
              </div>
            }
            loadingText={
              <div className="center-flex">
                <PuffLoader size={16} color="#fff" />
              </div>
            }
            onClick={() => {
              setRequisitionStatus('purchased');
            }}
            disabled={requisitionStatus === 'purchased' ? true : false}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Purchase Requests</h1>
      <div className="d-flex justify-content-end">
        <ReactiveButton
          buttonState="idle"
          color="indigo"
          idleText="Add New"
          rounded
          onClick={() => {
            setOpenAddModal(true);
          }}
        />
      </div>
      <DataTable
        title={`List of all ${requisitionStatus} purchase requests`}
        columns={headerResponsive}
        data={allRequisitions}
        subHeader
        subHeaderComponent={subHeaderComponent()}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        defaultSortFieldId={1}
        responsive
        striped
        dense
      />

      <div className="w-100 d-flex justify-content-end">
        <Export
          onExport={() => downloadCSV(exportFileArray, 'Purchase Requisitions')}
        />
      </div>

      <Modal
        show={openAddModal}
        onHide={() => setOpenAddModal(false)}
        size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Item Requisition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PrModal
            setOpenModal={setOpenAddModal}
            setRefresh={setRefresh}
            userId={session.user.id}
          />
        </Modal.Body>
      </Modal>

      <ProcessPr
        openProcessModal={openProcessModal}
        setOpenProcessModal={setOpenProcessModal}
        currentItem={currentItem}
        user={session.user}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default ItemPurchase;
