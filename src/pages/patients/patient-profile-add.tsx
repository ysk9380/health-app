import React, { useCallback, useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";
import { ArrowForward, Cancel } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { getGenders } from "../../services/master-data-service";
import { Gender } from "../../models/master";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/loading-slice";
import { setPatientProfile } from "../../store/patient-slice";
import { useTranslation } from "react-i18next";
import {
  InsertPatientProfileRequestModel,
  PatientProfileState,
  UpdatePatientProfileRequestModel,
} from "../../models/patient";
import {
  insertPatientProfile,
  updatePatientProfile,
} from "../../services/patient-service";
import { RootState } from "../../store/store";
import LinearProgress from "@mui/material/LinearProgress";
import { useSnackbar } from "../../components/Snackbar";

interface PatientProfileAddProps {
  onNext: () => void;
  onCancel: () => void;
}

interface PatientProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date | null;
  genderCode: string;
}

export const PatientProfileAdd: React.FC<PatientProfileAddProps> = ({
  onNext,
  onCancel,
}: PatientProfileAddProps) => {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [screenDataLoading, setScreenDataLoading] = useState<boolean>(true);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const currentPatientProfile = useSelector(
    (state: RootState) => state.currentPatient.profile
  );

  const schema = yup.object<PatientProfile>().shape({
    firstName: yup
      .string()
      .required(t("validation.firstNameRequired"))
      .matches(/^[A-Za-z]+$/, t("validation.onlyAlphabetsAllowed")),
    middleName: yup
      .string()
      .matches(/^[A-Za-z]*$/, "Only alphabets are allowed"),
    lastName: yup
      .string()
      .required(t("validation.lastNameRequired"))
      .matches(/^[A-Za-z]+$/, t("validation.onlyAlphabetsAllowed")),
    dateOfBirth: yup
      .date()
      .nullable()
      .required(t("validation.dateOfBirthRequired"))
      .max(new Date(), t("validation.dateOfBirthFuture")),
    genderCode: yup.string().required(t("validation.genderRequired")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientProfile>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      firstName: currentPatientProfile?.firstname || "",
      middleName: currentPatientProfile?.middlename || "",
      lastName: currentPatientProfile?.lastname || "",
      genderCode: currentPatientProfile?.genderCode || "",
      dateOfBirth:
        (currentPatientProfile?.dateOfBirth &&
          new Date(currentPatientProfile?.dateOfBirth)) ||
        null,
    },
  });

  const addNewPatientProfile = async (
    data: PatientProfile
  ): Promise<boolean> => {
    let result = false;
    const insertPatientProfileRequestModel: InsertPatientProfileRequestModel = {
      firstname: data.firstName,
      middlename: data.middleName,
      lastname: data.lastName,
      genderCode: data.genderCode,
      dateOfBirth: data.dateOfBirth,
      forceCreate: false,
    };

    try {
      dispatch(setLoading(true));
      const newPatientProifle: PatientProfileState | null =
        await insertPatientProfile(insertPatientProfileRequestModel);

      if (newPatientProifle) {
        const patientProfileState: PatientProfileState = {
          patientId: newPatientProifle.patientId,
          firstname: data.firstName,
          middlename: data.middleName,
          lastname: data.lastName,
          genderCode: data.genderCode,
          dateOfBirth: data.dateOfBirth?.toISOString() ?? "",
          genderName:
            genders.find((g) => g.genderCode === data.genderCode)?.genderName ??
            "",
          patientCode: newPatientProifle.patientCode,
        };
        dispatch(setPatientProfile(patientProfileState));
        result = true;
        showSnackbar(t("patient.patientProfileAdded"), "success");
      } else {
        showSnackbar(t("patient.patientProfileNotAdded"), "error");
      }
    } catch (error) {
      console.error("Error inserting patient profile:", error);
      showSnackbar(t("patient.patientProfileAddError"), "error");
    } finally {
      dispatch(setLoading(false));
    }

    return result;
  };

  const updateExistingPatientProfile = async (
    data: PatientProfile
  ): Promise<boolean> => {
    let result = false;
    const updatePatientProfileRequestModel: UpdatePatientProfileRequestModel = {
      patientId: currentPatientProfile?.patientId ?? 0,
      firstname: data.firstName,
      middlename: data.middleName,
      lastname: data.lastName,
      genderCode: data.genderCode,
      dateOfBirth: data.dateOfBirth,
    };

    try {
      dispatch(setLoading(true));
      const updatedPatientProifle: PatientProfileState | null =
        await updatePatientProfile(updatePatientProfileRequestModel);

      if (updatedPatientProifle) {
        const patientProfileState: PatientProfileState = {
          patientId: updatedPatientProifle.patientId,
          firstname: data.firstName,
          middlename: data.middleName,
          lastname: data.lastName,
          genderCode: data.genderCode,
          dateOfBirth: data.dateOfBirth?.toISOString() ?? "",
          genderName:
            genders.find((g) => g.genderCode === data.genderCode)?.genderName ??
            "",
          patientCode: updatedPatientProifle.patientCode,
        };
        dispatch(setPatientProfile(patientProfileState));
        result = true;
        showSnackbar(t("patient.patientProfileUpdated"), "success");
      } else {
        showSnackbar(t("patient.patientProfileNotUpdated"), "error");
      }
    } catch (error) {
      console.error("Error updating patient profile:", error);
      showSnackbar(t("patient.patientProfileUpdateError"), "error");
    } finally {
      dispatch(setLoading(false));
    }

    return result;
  };

  const onSubmit = async (data: PatientProfile) => {
    let result = false;
    if (currentPatientProfile && currentPatientProfile.patientId > 0) {
      result = await updateExistingPatientProfile(data);
    } else {
      result = await addNewPatientProfile(data);
    }
    if (result) onNext();
  };

  const fetchGenderTypes = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const genders = await getGenders();
      setGenders(genders);
      setScreenDataLoading(false);
    } catch (error) {
      console.error("Error fetching gender types:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.ctrlKey && event.key) {
      switch (event.key.toLowerCase()) {
        case "f":
          firstNameRef.current?.focus();
          break;
        case "m":
          middleNameRef.current?.focus();
          break;
        case "l":
          lastNameRef.current?.focus();
          break;
        case "d":
          dateOfBirthRef.current?.focus();
          break;
        case "g":
          genderTypeCodeRef.current?.focus();
          break;
        default:
          break;
      }
    }
  };

  const firstNameRef = useRef<HTMLInputElement>(null);
  const middleNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const dateOfBirthRef = useRef<HTMLInputElement>(null);
  const genderTypeCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    fetchGenderTypes();
  }, [fetchGenderTypes]);

  if (screenDataLoading || genders.length === 0) {
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
      onKeyDown={handleKeyDown}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("firstName")}
                variant="outlined"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ""}
                size="small"
                inputProps={{ maxLength: 100 }}
                inputRef={firstNameRef}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="middleName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("middleName")}
                variant="outlined"
                fullWidth
                error={!!errors.middleName}
                helperText={errors.middleName ? errors.middleName.message : ""}
                size="small"
                inputProps={{ maxLength: 100 }}
                inputRef={middleNameRef}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t("lastName")}
                variant="outlined"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName ? errors.lastName.message : ""}
                size="small"
                inputProps={{ maxLength: 100 }}
                inputRef={lastNameRef}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="dateOfBirth"
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
                    error: !!errors.dateOfBirth,
                    helperText: errors.dateOfBirth?.message,
                    fullWidth: true,
                  },
                }}
                disableFuture
                inputRef={dateOfBirthRef}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Controller
            name="genderCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label={t("gender")}
                variant="outlined"
                fullWidth
                error={!!errors.genderCode}
                helperText={errors.genderCode ? errors.genderCode.message : ""}
                size="small"
                inputRef={genderTypeCodeRef}
              >
                {genders.map((g) => (
                  <MenuItem key={g.genderId} value={g.genderCode}>
                    {g.genderName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        {/* Add more form controls here in the same pattern */}
      </Grid>

      <Box display="flex" justifyContent="space-between" marginTop="20px">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Cancel />}
          onClick={onCancel}
        >
          {t("cancel")}
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

export default PatientProfileAdd;
