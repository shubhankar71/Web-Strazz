import { useCallback, useEffect, useState } from "react";
import { toUserFacingDataError } from "../utils/dataErrors.js";

export default function useAsyncData(loader, dependencies = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));
    Promise.resolve()
      .then(loader)
      .then((data) => { if (active) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (active) setState({ data: null, loading: false, error: toUserFacingDataError(error) }); });
    return () => { active = false; };
    // Loader inputs are represented by dependencies at call sites.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, revision]);

  return { ...state, reload };
}
