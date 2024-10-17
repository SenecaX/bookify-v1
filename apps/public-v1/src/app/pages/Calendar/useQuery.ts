import { useLocation } from "react-router-dom";

export const useQueryParams = () => {
    const query = new URLSearchParams(useLocation().search);
    return {
      providerId: query.get('providerId'),
      serviceId: query.get('serviceId'),
    };
  };
  