import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getAddressTypes, getStates } from "../../services/master-data-service";
import { AddressType, State } from "../../models/master";
import {
  InsertPatientAddressRequestModel,
  PatientAddressState,
  UpdatePatientAddressRequestModel,
} from "../../models/patient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setLoading } from "../../store/loading-slice";
import {
  insertPatientAddress,
  updatePatientAddress,
} from "../../services/patient-service";
import { setPatientAddress } from "../../store/patient-slice";
import { useSnackbar } from "../../components/Snackbar";

interface PatientAddressAddProps {
  onBack: () => void;
  onNext: () => void;
}

interface AddressFormValues {
  addressTypeCode: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  pincode: string;
  stateCode: string;
}

const PatientAddressAdd: React.FC<PatientAddressAddProps> = ({
  onBack,
  onNext,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentPatientProfile = useSelector(
    (state: RootState) => state.currentPatient.profile
  );
  const currentPatientAddress = useSelector(
    (state: RootState) => state.currentPatient.address
  );
  const { showSnackbar } = useSnackbar();

  const [addressTypes, setAddressTypes] = useState<AddressType[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [screenDataLoading, setScreenDataLoading] = useState<boolean>(true);

  const schema = yup.object().shape({
    addressTypeCode: yup
      .string()
      .required(t("validation.typeOfAddressRequired")),
    addressLine1: yup.string().required(t("validation.addressLine1Required")),
    addressLine2: yup.string(),
    addressLine3: yup.string(),
    city: yup.string().required(t("validation.cityRequired")),
    pincode: yup.string().required(t("validation.pincodeRequired")),
    stateCode: yup.string().required(t("validation.stateRequired")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      addressTypeCode: currentPatientAddress?.addressTypeCode || "",
      addressLine1: currentPatientAddress?.addressLine1 || "",
      addressLine2: currentPatientAddress?.addressLine2 || "",
      addressLine3: currentPatientAddress?.addressLine3 || "",
      city: currentPatientAddress?.city || "",
      pincode: currentPatientAddress?.pincode || "",
      stateCode: currentPatientAddress?.stateCode || "",
    },
  });

  const fetchAddressTypes = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const addressTypes = await getAddressTypes();
      setAddressTypes(addressTypes);
      setScreenDataLoading(false);
    } catch (error) {
      console.error("Error fetching address types:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const fetchStates = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const states = await getStates();
      setStates(states);
      setScreenDataLoading(false);
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const addNewPatientAddress = async (
    data: AddressFormValues
  ): Promise<boolean> => {
    let result = false;
    try {
      dispatch(setLoading(true));
      const insertPatientAddressRequestModel: InsertPatientAddressRequestModel =
        {
          patientId: currentPatientProfile?.patientId ?? 0,
          addressTypeCode: data.addressTypeCode,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          addressLine3: data.addressLine3,
          city: data.city,
          pincode: data.pincode,
          stateCode: data.stateCode,
        };
      const newPatientAddress = await insertPatientAddress(
        insertPatientAddressRequestModel
      );

      if (newPatientAddress) {
        const patientAddressState: PatientAddressState = {
          patientAddressId: newPatientAddress.patientAddressId,
          patientId: currentPatientProfile?.patientId ?? 0,
          addressTypeCode: data.addressTypeCode,
          addressTypeName:
            addressTypes.find((t) => t.addressTypeCode === data.addressTypeCode)
              ?.addressTypeName ?? "",
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          addressLine3: data.addressLine3,
          city: data.city,
          pincode: data.pincode,
          stateCode: data.stateCode,
          stateName:
            states.find((s) => s.stateCode === data.stateCode)?.stateName ?? "",
        };
        dispatch(setPatientAddress(patientAddressState));
        showSnackbar(t("patient.patientAddressAdded"), "success");
        result = true;
      } else {
        showSnackbar(t("patient.patientAddressNotAdded"), "error");
      }
    } catch (error) {
      console.error("Error inserting patient address:", error);
      showSnackbar(t("patient.patientAddressAddError"), "error");
    } finally {
      dispatch(setLoading(false));
    }
    return result;
  };

  const updateExistingPatientAddress = async (
    data: AddressFormValues
  ): Promise<boolean> => {
    let result = false;
    try {
      dispatch(setLoading(true));
      const updatePatientAddressRequestModel: UpdatePatientAddressRequestModel =
        {
          patientAddressId: currentPatientAddress?.patientAddressId ?? 0,
          addressTypeCode: data.addressTypeCode,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          addressLine3: data.addressLine3,
          city: data.city,
          pincode: data.pincode,
          stateCode: data.stateCode,
        };
      const updatedPatientAddress = await updatePatientAddress(
        updatePatientAddressRequestModel
      );

      if (updatedPatientAddress) {
        const patientAddressState: PatientAddressState = {
          patientAddressId: updatedPatientAddress.patientAddressId,
          patientId: currentPatientProfile?.patientId ?? 0,
          addressTypeCode: data.addressTypeCode,
          addressTypeName:
            addressTypes.find((t) => t.addressTypeCode === data.addressTypeCode)
              ?.addressTypeName ?? "",
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          addressLine3: data.addressLine3,
          city: data.city,
          pincode: data.pincode,
          stateCode: data.stateCode,
          stateName:
            states.find((s) => s.stateCode === data.stateCode)?.stateName ?? "",
        };
        dispatch(setPatientAddress(patientAddressState));
        showSnackbar(t("patient.patientAddressUpdated"), "success");
        result = true;
      } else {
        showSnackbar(t("patient.patientAddressNotUpdate"), "error");
      }
    } catch (error) {
      console.error("Error inserting patient address:", error);
      showSnackbar(t("patient.patientAddressUpdateError"), "error");
    } finally {
      dispatch(setLoading(false));
    }
    return result;
  };

  const onSubmit = async (data: AddressFormValues) => {
    let result = false;
    if (currentPatientAddress && currentPatientAddress.patientAddressId > 0) {
      result = await updateExistingPatientAddress(data);
    } else {
      result = await addNewPatientAddress(data);
    }
    if (result) onNext();
  };

  useEffect(() => {
    fetchAddressTypes();
    fetchStates();
  }, [fetchAddressTypes, fetchStates]);

  if (screenDataLoading || addressTypes.length === 0 || states.length === 0) {
    return (
      <Box marginTop={3} width="100%" color="grey.500">
        <LinearProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      marginTop={3}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Controller
            name="addressTypeCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t("typeOfAddress")}
                fullWidth
                error={!!errors.addressTypeCode}
                helperText={errors.addressTypeCode?.message}
                size="small"
              >
                {addressTypes.map((type) => (
                  <MenuItem
                    key={type.addressTypeId}
                    value={type.addressTypeCode}
                  >
                    {type.addressTypeName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="addressLine1"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("addressLine1")}
                fullWidth
                error={!!errors.addressLine1}
                helperText={errors.addressLine1?.message}
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="addressLine2"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("addressLine2")}
                fullWidth
                error={!!errors.addressLine2}
                helperText={errors.addressLine2?.message}
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="addressLine3"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("addressLine3")}
                fullWidth
                error={!!errors.addressLine3}
                helperText={errors.addressLine3?.message}
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("city")}
                fullWidth
                error={!!errors.city}
                helperText={errors.city?.message}
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="pincode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("pincode")}
                fullWidth
                error={!!errors.pincode}
                helperText={errors.pincode?.message}
                size="small"
                inputProps={{ maxLength: 10 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="stateCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t("state")}
                fullWidth
                error={!!errors.stateCode}
                helperText={errors.stateCode?.message}
                size="small"
              >
                {states.map((state) => (
                  <MenuItem key={state.stateId} value={state.stateCode}>
                    {state.stateName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" marginTop="20px">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBack />}
          onClick={onBack}
        >
          {t("back")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForward />}
          type="submit"
        >
          {t("next")}
        </Button>
      </Box>
    </Box>
  );
};

export default PatientAddressAdd;
