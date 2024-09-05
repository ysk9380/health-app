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
import { DatePicker } from "@mui/x-date-pickers";
import { getIdentityTypes } from "../../services/master-data-service";
import { IdentityType } from "../../models/master";
import { setLoading } from "../../store/loading-slice";
import { useDispatch, useSelector } from "react-redux";
import {
  InsertPatientIdentityRequestModel,
  PatientIdentityState,
  UpdatePatientIdentityRequestModel,
} from "../../models/patient";
import {
  insertPatientIdentity,
  updatePatientIdentity,
} from "../../services/patient-service";
import { RootState } from "../../store/store";
import { setPatientIdentity } from "../../store/patient-slice";
import { useSnackbar } from "../../components/Snackbar";

interface PatientIdentityAddProps {
  onNext: () => void;
  onBack: () => void;
}

interface PatientIdentity {
  identityTypeCode: string;
  identityNumber: string;
  issuedBy: string;
  placeIssued: string;
  expiry: Date | null;
}

export const PatientIdentityAdd: React.FC<PatientIdentityAddProps> = ({
  onNext,
  onBack,
}) => {
  const [identityTypes, setIdentityTypes] = useState<IdentityType[]>([]);
  const [screenDataLoading, setScreenDataLoading] = useState<boolean>(true);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentPatientProfile = useSelector(
    (state: RootState) => state.currentPatient.profile
  );
  const currentPatientIdentity = useSelector(
    (state: RootState) => state.currentPatient.identity
  );
  const { showSnackbar } = useSnackbar();

  const schema = yup.object<PatientIdentity>().shape({
    identityTypeCode: yup
      .string()
      .required(t("validation.identityTypeRequired")),
    identityNumber: yup
      .string()
      .required(t("validation.identityNumberRequired"))
      .matches(
        /^[A-Za-z0-9]+$/,
        t("validation.onlyAlphabetsAndNumbersAllowed")
      ),
    issuedBy: yup
      .string()
      .required(t("validation.issuedByRequired"))
      .matches(/^[A-Za-z ]+$/, t("validation.onlyAlphabetsAllowed")),
    placeIssued: yup
      .string()
      .required(t("validation.placeIssuedRequired"))
      .matches(/^[A-Za-z ]+$/, t("validation.onlyAlphabetsAllowed")),
    expiryDate: yup.date().nullable(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientIdentity>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      identityTypeCode: currentPatientIdentity?.identityTypeCode || "",
      identityNumber: currentPatientIdentity?.identityNumber || "",
      issuedBy: currentPatientIdentity?.issuedBy || "",
      placeIssued: currentPatientIdentity?.placeIssued || "",
      expiry: currentPatientIdentity?.expiry
        ? new Date(currentPatientIdentity?.expiry)
        : null,
    },
  });

  const fetchIdentityTypes = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const identityTypes = await getIdentityTypes();
      setIdentityTypes(identityTypes);
      setScreenDataLoading(false);
    } catch (error) {
      console.error("Error fetching identity types:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const addNewPatientIdentity = async (
    data: PatientIdentity
  ): Promise<boolean> => {
    let result = false;
    const insertPatientIdentityRequestModel: InsertPatientIdentityRequestModel =
      {
        patientId: currentPatientProfile?.patientId ?? 0,
        identityTypeCode: data.identityTypeCode,
        identityNumber: data.identityNumber,
        issuedBy: data.issuedBy,
        placeIssued: data.placeIssued,
        expiry: data.expiry,
      };

    try {
      dispatch(setLoading(true));
      const newPatientIdentity: PatientIdentityState | null =
        await insertPatientIdentity(insertPatientIdentityRequestModel);

      if (newPatientIdentity) {
        const patientIdentityState: PatientIdentityState = {
          patientIdentityId: newPatientIdentity.patientIdentityId,
          patientId: currentPatientProfile?.patientId ?? 0,
          identityTypeCode: data.identityTypeCode,
          identityNumber: data.identityNumber,
          issuedBy: data.issuedBy,
          placeIssued: data.placeIssued,
          expiry: data.expiry?.toISOString() ?? undefined,
        };
        dispatch(setPatientIdentity(patientIdentityState));
        showSnackbar(t("patient.patientIdentityAdded"), "success");
        result = true;
      } else {
        showSnackbar(t("patient.patientIdentityNotAdded"), "error");
      }
    } catch (error) {
      console.error("Error inserting patient identity:", error);
      showSnackbar(t("patient.patientIdentityAddError"), "error");
    } finally {
      dispatch(setLoading(false));
    }
    return result;
  };

  const updateExistingPatientIdentity = async (
    data: PatientIdentity
  ): Promise<boolean> => {
    let result = false;
    const updatePatientIdentityRequestModel: UpdatePatientIdentityRequestModel =
      {
        patientIdentityId: currentPatientIdentity?.patientIdentityId ?? 0,
        identityTypeCode: data.identityTypeCode,
        identityNumber: data.identityNumber,
        issuedBy: data.issuedBy,
        placeIssued: data.placeIssued,
        expiry: data.expiry,
      };

    try {
      dispatch(setLoading(true)); // Set loading to true before the API call
      const updatedPatientIdentity: PatientIdentityState | null =
        await updatePatientIdentity(updatePatientIdentityRequestModel);

      if (updatedPatientIdentity) {
        const patientIdentityState: PatientIdentityState = {
          patientIdentityId: updatedPatientIdentity.patientIdentityId,
          patientId: currentPatientProfile?.patientId ?? 0,
          identityTypeCode: data.identityTypeCode,
          identityNumber: data.identityNumber,
          issuedBy: data.issuedBy,
          placeIssued: data.placeIssued,
          expiry: data.expiry?.toISOString() ?? undefined,
        };
        dispatch(setPatientIdentity(patientIdentityState));
        showSnackbar(t("patient.patientIdentityUpdated"), "success");
        result = true;
      } else {
        showSnackbar(t("patient.patientIdentityNotUpdated"), "error");
      }
    } catch (error) {
      console.error("Error updating patient identity:", error);
      showSnackbar(t("patient.patientIdentityUpdateError"), "error");
    } finally {
      dispatch(setLoading(false));
    }
    return result;
  };

  const onSubmit = async (data: PatientIdentity) => {
    let result = false;
    if (
      currentPatientIdentity &&
      currentPatientIdentity.patientIdentityId > 0
    ) {
      result = await updateExistingPatientIdentity(data);
    } else {
      result = await addNewPatientIdentity(data);
    }

    if (result) onNext();
  };

  useEffect(() => {
    fetchIdentityTypes();
  }, [fetchIdentityTypes]);

  if (screenDataLoading || identityTypes.length === 0) {
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
      sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 3 }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Controller
            name="identityTypeCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("identityType")}
                variant="outlined"
                fullWidth
                error={!!errors.identityTypeCode}
                helperText={
                  errors.identityTypeCode ? errors.identityTypeCode.message : ""
                }
                size="small"
                select
              >
                {identityTypes.map((identityType: IdentityType) => (
                  <MenuItem
                    key={identityType.identityTypeId}
                    value={identityType.identityTypeCode}
                  >
                    {identityType.identityTypeName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="identityNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("identityNumber")}
                variant="outlined"
                fullWidth
                error={!!errors.identityNumber}
                helperText={
                  errors.identityNumber ? errors.identityNumber.message : ""
                }
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="issuedBy"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("issuedBy")}
                variant="outlined"
                fullWidth
                error={!!errors.placeIssued}
                helperText={errors.issuedBy ? errors.issuedBy.message : ""}
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="placeIssued"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("placeIssued")}
                variant="outlined"
                fullWidth
                error={!!errors.placeIssued}
                helperText={
                  errors.placeIssued ? errors.placeIssued.message : ""
                }
                size="small"
                inputProps={{ maxLength: 100 }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="expiry"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label={t("dob")}
                format="yyyy-MM-dd"
                value={field.value}
                onChange={(date) => field.onChange(date)}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    size: "small",
                    error: !!errors.expiry,
                    helperText: errors.expiry?.message,
                    fullWidth: true,
                  },
                }}
              />
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

export default PatientIdentityAdd;
