import { RoadDataDTO, RoadNodeDTO } from "../interfaces/map/mapInterfaces";
import { GetRoadListContract } from "./ApiContracts/mapContracts";

interface IMapModel {
  getRoadList: () => Promise<Array<RoadDataDTO>>;
  saveRoadData: (road: RoadDataDTO) => Promise<boolean>;
  updateRoad: (road: RoadDataDTO) => Promise<boolean>;
}

export class MapModelProxy implements IMapModel {
  private serverUrl = "http://localhost:8080/";

  private async getRoadListFromServer(): Promise<Array<GetRoadListContract> | null> {
    const requestUrl = this.serverUrl + "map";

    try {
      const response = await fetch(requestUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return null;
      }

      const jsonResponse = await response.json();
      return jsonResponse as Array<GetRoadListContract>;
    } catch (error: any) {
      return null;
    }
  }

  async getRoadList(): Promise<Array<RoadDataDTO>> {
    const roadList = await this.getRoadListFromServer();

    if (roadList === null) {
      return new Array<RoadDataDTO>();
    }

    return roadList.map((item) => {
      const roadDataDTO: RoadDataDTO = {
        id: item.id,
        name: item.name,
        length: item.length,
        nodes: item.nodes.map((node) => {
          const roadNode: RoadNodeDTO = {
            id: node.id,
            latitude: node.latitude,
            longitude: node.longitude,
          };
          return roadNode;
        }),
      };
      return roadDataDTO;
    });
  }

  async saveRoadData(road: RoadDataDTO): Promise<boolean> {
    const requestUrl = this.serverUrl + "map";

    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(road),
      });

      if (response.status === 201) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      return false;
    }
  }

  async updateRoad(road: RoadDataDTO): Promise<boolean> {
    const requestUrl = this.serverUrl + "map";

    try {
      const response = await fetch(requestUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(road),
      });

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error: any) {
      return false;
    }
  }
}
