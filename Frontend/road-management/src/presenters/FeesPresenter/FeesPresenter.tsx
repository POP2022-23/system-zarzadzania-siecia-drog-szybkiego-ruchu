﻿import React, { useEffect, useState } from "react";
import PaidFeesListWindow from "../../views/PaidFees/PaidFeesListWindow";
import { FeesModelProxy } from "../../models/FeesModelProxy";
import { FeesDTO } from "../../interfaces/fees/feesinterfaces";
import { useNavigate } from "react-router-dom";
import PaidFeeDetailsWindow from "../../views/PaidFees/PaidFeeDetailsWindow";
import UnpaidFeesListWindow from "../../views/UnpaidFees/UnpaidFeesListWindow";
import UnpaidFeeDetailsWindow from "../../views/UnpaidFees/UnpaidFeeDetailsWindow";

export enum Action {
  PaidFees,
  UnpaidFees,
}

interface IFeesPresenter {
  action: Action;
}

function FeesPresenter({ action }: IFeesPresenter) {
  const navigate = useNavigate();
  const [feesList, setFeesList] = useState<FeesDTO[]>(new Array<FeesDTO>());
  const [unpaidFees, setUnpaidFees] = useState<FeesDTO[]>(new Array<FeesDTO>());
  const [selectedFeeId, setSelectedFeeId] = useState<number | undefined>();
  const [makePayment, setMakePayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | undefined>();

  useEffect(() => {
    const feesModel = new FeesModelProxy();

    async function fetchPaidFeesList() {
      const response = await feesModel.getPaidFeesList("1");
      if (response !== null) {
        setFeesList(response);
      }
    }

    async function fetchUnpaidFeesList() {
      const response = await feesModel.getUnpaidFeesList("1");
      if (response !== null) {
        setUnpaidFees(response);
      }
    }

    switch (action) {
      case Action.PaidFees:
        fetchPaidFeesList();
        break;
      case Action.UnpaidFees:
        fetchUnpaidFeesList();
    }
  }, []);

  function onReturnToMainMenuClicked() {
    navigate("/fees");
  }

  function onViewPaidFeeDetailsClicked(feeId: number) {
    setSelectedFeeId(feeId);
  }

  function onViewUnpaidFeeDetailsClicked(feeId: number) {
    setSelectedFeeId(feeId);
  }

  async function onMakePaymentClicked(
    name: String,
    surname: String,
    email: String,
    phoneNumber: String,
    paymentType: String
  ) {
    setMakePayment(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setMakePayment(false);

    setPaymentSuccess(paymentType !== "card");
  }

  function onReturnToPaidFeeListClicked() {
    setMakePayment(false);
    setSelectedFeeId(undefined);
  }

  function openPaidFeesListWindow(): JSX.Element {
    return (
      <PaidFeesListWindow
        feesList={feesList}
        onReturnClicked={onReturnToMainMenuClicked}
        onViewDetailsClicked={onViewPaidFeeDetailsClicked}
      />
    );
  }

  function openPaidFeeDetailsWindow(feeId: number): JSX.Element {
    return (
      <PaidFeeDetailsWindow
        feeId={feeId}
        onReturnClicked={onReturnToPaidFeeListClicked}
      />
    );
  }

  function openUnpaidFeesListWindow(): JSX.Element {
    return (
      <UnpaidFeesListWindow
        feesList={unpaidFees}
        onReturnClicked={onReturnToMainMenuClicked}
        onViewUnpaidFeeDetailsClicked={onViewUnpaidFeeDetailsClicked}
      />
    );
  }

  function openUnpaidFeeDetailsWindow(feeId: number): JSX.Element {
    return (
      <UnpaidFeeDetailsWindow
        feeId={feeId}
        onReturnClicked={onReturnToPaidFeeListClicked}
        onMakePaymentClicked={onMakePaymentClicked}
      />
    );
  }

  function openMakePaymentWindow(): JSX.Element {
    return <h1>Przekierowanie do płatności</h1>;
  }

  function openPaymentSuccessfulWindow(): JSX.Element {
    return <h1>Płatność powiodła się</h1>;
  }

  function openPaymentFailedWindow(): JSX.Element {
    return <h1>Płatność nie powiodła się</h1>;
  }

  function render(selectedAction: Action): JSX.Element {
    switch (selectedAction) {
      case Action.PaidFees: {
        return selectedFeeId !== undefined
          ? openPaidFeeDetailsWindow(selectedFeeId)
          : openPaidFeesListWindow();
      }

      case Action.UnpaidFees:
        if (paymentSuccess === true) {
          return openPaymentSuccessfulWindow();
        } else if (paymentSuccess === false) {
          return openPaymentFailedWindow();
        }

        if (makePayment) {
          return openMakePaymentWindow();
        }

        return selectedFeeId !== undefined
          ? openUnpaidFeeDetailsWindow(selectedFeeId)
          : openUnpaidFeesListWindow();
    }
  }

  return render(action);
}

export default FeesPresenter;
