/* eslint-disable @typescript-eslint/no-unused-vars */
import GeneralResource, { GeneralResourceContent } from "@/models/GeneralResource";
import SessionResource from "@/models/SessionResource";
import type { AxiosInstance } from "axios";
import RemoteServices from "./RemoteService";

export default class ResourceService {
  static async getAllGeneralResources(httpClient: AxiosInstance): Promise<GeneralResource[]> { 
    return httpClient.get('/resource/general/all')
      .then(response => {
        return response.data.map((data: any) => new GeneralResource(data));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getAllPackResources(httpClient: AxiosInstance, packName: string): Promise<GeneralResource[]> {
    return httpClient.get(`/resource/pack/all/` + packName)
      .then(response => {
        return response.data.map((data: any) => new GeneralResource(data));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getResourceFile(httpClient: AxiosInstance, resourceId: number, resourceIndex: number): Promise<void> { 
    return httpClient.get('/resource/download/'+ resourceId + '/' + resourceIndex, { responseType: 'blob'})
      .then(response => {
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        console.log(response.headers);
        console.log(response.data.header);
        let filename = "";
        const contentDisposition = response.headers['content-disposition'];
        if(!contentDisposition) {
          throw new Error("Download should have content disposition")
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }

        link.setAttribute('download', filename);        
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        console.log("downloaded");
        //return response.data.map((data: any) => new GeneralResource(data));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getAllSessionResources(httpClient: AxiosInstance, username: string): Promise<SessionResource[]> { 
    return httpClient.get('/resource/session/all/' + username)
      .then(response => {
        return response.data.map((data: any) => new SessionResource(data));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async getSessionResourceFile(httpClient: AxiosInstance, packName: string, sessionIndex: number, resourceNumber: number): Promise<void> { 
    return httpClient.get('/resource/session/download/' + packName + `/` +  sessionIndex + `/` + resourceNumber, { responseType: 'blob'})
      .then(response => {
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        console.log(response.headers);
        console.log(response.data.header);
        let filename = "";
        
        const contentDisposition = response.headers['content-disposition'];
        if(!contentDisposition) {
          throw new Error("Download should have content disposition")
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
        
        link.setAttribute('download', filename);        
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        console.log("downloaded");
        //return response.data.map((data: any) => new GeneralResource(data));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }


  static async createGeneralResource(httpClient: AxiosInstance, packName: string, resourceName: string): Promise<void> {
    RemoteServices.checkAreValidStringsForRoute([resourceName]);
    return httpClient.post(`/resource/pack/new`, {
      packName: packName,
      resourceName: resourceName
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async deleteGeneralResource(httpClient: AxiosInstance, packName: string, index: number): Promise<void> {
    return httpClient.delete(`/resource/pack/single/` + packName + '/' + index)
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async changeOneGeneralResource(httpClient: AxiosInstance, packName: string, resourceIndex: number, resource: GeneralResource): Promise<void> {
    return httpClient.put(`/resource/pack/single`, {
      packName: packName,
      generalResource: resource,
      resourceIndex: resourceIndex,
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async swapOrderGeneralResource(httpClient: AxiosInstance, packName: string, index1: number, index2: number): Promise<void> {
    return httpClient.post(`/resource/pack/swap`, {
      packName: packName,
      index1: index1,
      index2: index2,
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }


  static async createGeneralResourceContent(httpClient: AxiosInstance, packName: string, resourceNumber: number, resourceName: string): Promise<void> {
    RemoteServices.checkAreValidStringsForRoute([resourceName]);
    return httpClient.post(`/resource/content/pack/new`, {
      packName: packName,
      resourceName: resourceName,
      resourceIndex: resourceNumber,
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async deleteGeneralResourceContent(httpClient: AxiosInstance, packName: string, index: number, contentNumber: number): Promise<void> {
    return httpClient.delete(`/resource/content/pack/single/` + packName + '/' + index + '/' + contentNumber)
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }

  static async changeOneGeneralResourceContent(httpClient: AxiosInstance, packName: string, resourceIndex: number, contentNumber: number, resource: GeneralResourceContent): Promise<void> {
    return httpClient.put(`/resource/content/pack/single`, {
      packName: packName,
      generalResourceContent: resource,
      resourceIndex: resourceIndex,
      contentNumber: contentNumber,
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
  static async swapOrderGeneralResourceContent(httpClient: AxiosInstance, packName: string, resourceNumber: number, index1: number, index2: number): Promise<void> {
    return httpClient.post(`/resource/content/pack/swap`, {
      packName: packName,
      resourceNumber: resourceNumber,
      index1: index1,
      index2: index2,
    })
      .then(response => {
        
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }


  static async postGeneralResourceFile(httpClient: AxiosInstance, packName: string, resourceNumber: number, contentIndex: number, formData: FormData): Promise<void> {
    return httpClient.post(`/general/resource/pack/download/` + packName + `/` + resourceNumber + `/` + contentIndex, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
        //nothing
      })
      .catch(async error => {
        console.log(error);
        throw Error(error);
      });   
  }

  static async getGeneralResourceFile(httpClient: AxiosInstance, packName: string, resourceNumber: number, contentNumber: number): Promise<void> { 
    return httpClient.get('/resource/pack/download/' + packName + `/` +  resourceNumber + `/` + contentNumber, { responseType: 'blob'})
      .then(response => {
        // create file link in browser's memory
        const href = URL.createObjectURL(response.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        console.log(response.headers);
        console.log(response.data.header);
        let filename = "";
        
        const contentDisposition = response.headers['content-disposition'];
        if(!contentDisposition) {
          throw new Error("Download should have content disposition")
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
                
        link.setAttribute('download', filename);        
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        console.log("downloaded");
        //return response.data.map((data: any) => new GeneralResource(data));
      })
      .catch(async error => {
        throw Error(error);
      }); 
  }
}