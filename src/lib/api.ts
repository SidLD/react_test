import axios from "axios";

export const fetchLunchesAPI = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.spacexdata.com/v3/launches`, {
          params: data
      })
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};


export const fetchLunchesByTermAPI = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`"https://api.spacexdata.com/v3/launches`, {
            params: { mission_name: data },
        })
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };

  export const fetchLunchesByIdAPI = (siteId:string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://api.spacexdata.com/v3/launchpads/${siteId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
