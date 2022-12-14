import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoadDataDTO } from "../../interfaces/map/mapInterfaces";
import { MapModelProxy } from "../../models/MapModelProxy";
import AddRoadView from "../../views/AddRoadView/AddRoadView";
import AddRoadValidator from "./AddRoadValidator";

function AddRoadPresenter() {
  const navigate = useNavigate();
  const [road, setRoad] = useState<RoadDataDTO | null>();
  const [valid, setValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onInputFieldChanged = (road: RoadDataDTO) => {
    var validationError = AddRoadValidator(road);

    setRoad(road);
    setError(validationError);
    setValid(validationError == null);
  };

  const onAddRoadClicked = async () => {
    if (valid) {
      const proxy = new MapModelProxy();

      const result = await proxy.saveRoadData(road!);

      if (result) {
        navigate("/map?message=Droga została dodana");
      } else {
        setError("Coś poszło nie tak, spróbuj ponownie później");
      }
    }
  };

  const onCancel = function () {
    navigate("/map");
  };

  return (
    <AddRoadView
      isValid={valid}
      errorMessage={error}
      onCancel={onCancel}
      onChanged={onInputFieldChanged}
      onSubmit={onAddRoadClicked}
    />
  );
}

export default AddRoadPresenter;
