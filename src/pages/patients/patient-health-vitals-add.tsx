import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBack from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import {
  getGenders,
  getHealthVitalParameters,
} from "../../services/master-data-service";
import { HealthVital } from "../../models/master";
import { setLoading } from "../../store/loading-slice";
import {
  InsertPatientHealthVitalRequestModel,
  PatientHealthVitalState,
} from "../../models/patient";
import { setPatientHealthVital } from "../../store/patient-slice";
import { insertPatientHealthVital } from "../../services/patient-service";

interface PatientHealthVitalsAddProps {
  onBack: () => void;
  onNext: () => void;
}

interface PatientHealthVital {
  healthVitalCode: string;
  healthVitalValue: string;
}

interface PatientHealthVitals {
  vitals: PatientHealthVital[];
}

const PatientHealthVitalsAdd: React.FC<PatientHealthVitalsAddProps> = ({
  onBack,
  onNext,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentPatientProfile = useSelector(
    (state: RootState) => state.currentPatient.profile
  );

  const [availableVitals, setAvailableVitals] = useState<HealthVital[]>([]);
  const [genderName, setGenderName] = useState<string>("");
  const [selectedVitalUnits, setSelectedVitalUnits] = useState<string[]>([]);

  const { control, handleSubmit, watch } = useForm<PatientHealthVitals>({
    defaultValues: {
      vitals: [{ healthVitalCode: "", healthVitalValue: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vitals",
  });

  const vitals = watch("vitals");

  const handleVitalChange = (index: number, value: string) => {
    const selectedVital = availableVitals.find(
      (vital) => vital.healthVitalCode === value
    )?.healthVitalUnit;
    setSelectedVitalUnits((prev) => {
      const newSelectedVitals = [...prev];
      newSelectedVitals[index] = selectedVital || "";
      return newSelectedVitals;
    });
  };

  const canAddMore = vitals.every(
    (vital: PatientHealthVital) =>
      vital.healthVitalCode && vital.healthVitalValue
  );

  const addNewPatientHealthVital = async (
    healthVitalTypeCode: string,
    healthVitalTypeValue: string
  ) => {
    if (healthVitalTypeCode !== "" && healthVitalTypeValue !== "") {
      const insertPatientHealthVitalRequestModel: InsertPatientHealthVitalRequestModel =
        {
          patientId: currentPatientProfile?.patientId ?? 0,
          healthVitalTypeCode: healthVitalTypeCode,
          healthVitalValue: healthVitalTypeValue,
        };

      const patientHealthVitalId = await insertPatientHealthVital(
        insertPatientHealthVitalRequestModel
      );
      const patientHealthVitalState: PatientHealthVitalState = {
        patientHealthVitalId: patientHealthVitalId,
        patientId: currentPatientProfile?.patientId ?? 0,
        healthVitalTypeCode: healthVitalTypeCode,
        healthVitalValue: healthVitalTypeValue,
      };
      dispatch(setPatientHealthVital(patientHealthVitalState));
    }
  };

  const addNewPatientHealthVitals = async (data: PatientHealthVitals) => {
    try {
      dispatch(setLoading(true));
      await Promise.all([
        data.vitals.map((vital) =>
          addNewPatientHealthVital(
            vital.healthVitalCode,
            vital.healthVitalValue
          )
        ),
      ]);
    } catch (error) {
      console.error("Error inserting patient contacts:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onSubmit = (data: PatientHealthVitals) => {
    addNewPatientHealthVitals(data);
    onNext();
  };

  function calculateAge(): string {
    const dateOfBirth = currentPatientProfile?.dateOfBirth;
    if (!dateOfBirth) {
      return "";
    }

    const currentDate = new Date();
    const birthDate = new Date(dateOfBirth ?? "");

    const yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();
    const monthsDiff = currentDate.getMonth() - birthDate.getMonth();
    const daysDiff = currentDate.getDate() - birthDate.getDate();

    let ageString = "";

    if (yearsDiff > 0) {
      ageString += `${yearsDiff} ${yearsDiff === 1 ? "year" : "years"}`;
    }

    if (monthsDiff > 0) {
      ageString += `${ageString ? ", " : ""}${monthsDiff} ${
        monthsDiff === 1 ? "month" : "months"
      }`;
    }

    if (daysDiff > 0) {
      ageString += `${ageString ? ", " : ""}${daysDiff} ${
        daysDiff === 1 ? "day" : "days"
      }`;
    }

    return ageString;
  }

  useEffect(() => {
    getHealthVitalParameters().then((vitals) => {
      setAvailableVitals(vitals);
    });

    getGenders().then((genders) => {
      const genderName =
        genders.find((g) => g.genderCode === currentPatientProfile?.genderCode)
          ?.genderName ?? "";
      setGenderName(genderName);
    });
  }, [currentPatientProfile?.genderCode]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} marginTop={3}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ backgroundColor: "#D3D3A2", padding: 2, borderRadius: 2 }}
          >
            <TextField
              label="Age"
              variant="outlined"
              size="small"
              fullWidth
              value={calculateAge()}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label={t("gender")}
              variant="outlined"
              size="small"
              fullWidth
              value={genderName}
              InputProps={{
                readOnly: true,
              }}
            />
          </Stack>
        </Grid>
        {fields.map((field, index) => (
          <Grid container item spacing={2} key={field.id}>
            <Grid item xs={12} sm={6}>
              <Controller
                name={`vitals.${index}.healthVitalCode` as const}
                control={control}
                defaultValue={field.healthVitalCode}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={t("typeOfHealthVital")}
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => {
                      field.onChange(e);
                      handleVitalChange(index, e.target.value);
                    }}
                  >
                    {availableVitals.map((vital) => (
                      <MenuItem
                        key={vital.healthVitalId}
                        value={vital.healthVitalCode}
                      >
                        {vital.healthVitalName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={10} sm={4} display="flex">
              <Controller
                name={`vitals.${index}.healthVitalValue` as const}
                control={control}
                defaultValue={field.healthVitalValue}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("value")}
                    variant="outlined"
                    size="small"
                    sx={{ width: "90%" }}
                  />
                )}
              />
              <Typography sx={{ marginLeft: 1, alignSelf: "flex-end" }}>
                {selectedVitalUnits[index]}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => remove(index)}>
                <CancelIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#808000",
              "&:hover": {
                backgroundColor: "#556B2F", // Darker shade of Khaki
              },
            }}
            onClick={() =>
              append({
                healthVitalCode: "",
                healthVitalValue: "",
              })
            }
            disabled={!canAddMore}
          >
            {t("addMore")}
          </Button>
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
          endIcon={<DoneIcon />}
          type="submit"
        >
          {t("finish")}
        </Button>
      </Box>
    </Box>
  );
};

export default PatientHealthVitalsAdd;
