import type { AxiosInstance } from "axios";

export default class ExportService {
  static async getSessionExcelData(httpClient: AxiosInstance, groupName: string, sessionIndex: number): Promise<void> {
    return httpClient.get(`/export/data/single/` + 
      groupName + '/' +
      sessionIndex, { responseType: 'blob'})
      .then(response => {
        
        console.log("got response");
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;

        const filename = 'AllData.xlsx' //static name
        link.setAttribute('download', filename);        
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        console.log("downloaded");
        //response
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getAllExcelData(httpClient: AxiosInstance, packName: string): Promise<void> {
    return httpClient.get(`/export/data/all/` + packName, { responseType: 'blob'})
      .then(response => {
        
        console.log("got response");
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;

        const filename = 'AllData.xlsx' //static name
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        console.log("downloaded");
        //response
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
}