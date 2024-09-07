import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import {
  InsertPatientEmailRequestModel,
  InsertPatientPhoneRequestModel,
  PatientEmailState,
  PatientPhoneState,
  UpdatePatientEmailRequestModel,
  UpdatePatientPhoneRequestModel,
} from "../../models/patient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  insertPatientEmail,
  insertPatientPhone,
  updatePatientEmail,
  updatePatientPhone,
} from "../../services/patient-service";
import { setPatientEmail, setPatientPhone } from "../../store/patient-slice";
import { setLoading } from "../../store/loading-slice";
import { PhoneType } from "../../models/master";
import { getPhoneTypes } from "../../services/master-data-service";
import { useSnackbar } from "../../components/Snackbar";

enum PhoneTypeCode {
  MOBILE = "MOBILE",
  HOME = "HOME",
  OTHER = "OTHER",
}

interface PatientContactAddProps {
  onBack: () => void;
  onNext: () => void;
}

interface ContactFormValues {
  mobilePhone: string;
  homePhone: string;
  otherPhone: string;
  email: string;
}

const PatientContactAdd: React.FC<PatientContactAddProps> = ({
  onBack,
  onNext,
}) => {
  const [phoneTypes, setPhoneTypes] = useState<PhoneType[]>();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentPatientProfile = useSelector(
    (state: RootState) => state.currentPatient.profile
  );
  const currentPatientPhones = useSelector(
    (state: RootState) => state.currentPatient.phones
  );
  const currentPatientEmail = useSelector(
    (state: RootState) => state.currentPatient.email
  );
  const { showSnackbar } = useSnackbar();

  const schema = yup.object().shape({
    mobilePhone: yup
      .string()
      .required(t("validation.mobilePhoneIsRequired"))
      .matches(/^\d{10}$/, t("validation.invalidMobilePhone")),
    homePhone: yup
      .string()
      .test(
        "is-valid-home-phone",
        t("validation.invalidHomePhone"),
        (value) => !value || /^\d+$/.test(value)
      ),
    otherPhone: yup
      .string()
      .test(
        "is-valid-other-phone",
        t("validation.invalidOtherPhone"),
        (value) => !value || /^\d+$/.test(value)
      ),
    email: yup.string().email(t("validation.invalidEmail")),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      mobilePhone:
        currentPatientPhones?.find(
          (phone) => phone.phoneTypeCode === PhoneTypeCode.MOBILE
        )?.phoneNumber ?? "",
      homePhone:
        currentPatientPhones?.find(
          (phone) => phone.phoneTypeCode === PhoneTypeCode.HOME
        )?.phoneNumber ?? "",
      otherPhone:
        currentPatientPhones?.find(
          (phone) => phone.phoneTypeCode === PhoneTypeCode.OTHER
        )?.phoneNumber ?? "",
      email: currentPatientEmail?.emailAddress ?? "",
    },
  });

  const addNewOrUpdateExistingPatientPhone = async (
    phoneTypeCode: string,
    phoneNumber: string,
    listedAs: string
  ) => {
    let result = false;
    if (phoneNumber !== "") {
      const existingPatientPhone = currentPatientPhones?.find(
        (p) => p.phoneTypeCode === phoneTypeCode
      );

      if (existingPatientPhone) {
        const updatePatientPhoneRequestModel: UpdatePatientPhoneRequestModel = {
          patientPhoneId: existingPatientPhone.patientPhoneId,
          phoneTypeCode: phoneTypeCode,
          phoneNumber: phoneNumber,
          listedAs: listedAs,
        };

        const updatedPatientPhone = await updatePatientPhone(
          updatePatientPhoneRequestModel
        );
        if (updatedPatientPhone) {
          const patientPhoneState: PatientPhoneState = {
            patientPhoneId: updatedPatientPhone?.patientPhoneId ?? 0,
            patientId: currentPatientProfile?.patientId ?? 0,
            phoneNumber: phoneNumber,
            phoneTypeCode: phoneTypeCode,
            phoneTypeName:
              phoneTypes?.find((type) => type.phoneTypeCode === phoneTypeCode)
                ?.phoneTypeName ?? "",
            listedAs: listedAs,
          };
          dispatch(setPatientPhone(patientPhoneState));
          result = true;
        }
      } else {
        const insertPatientPhoneRequestModel: InsertPatientPhoneRequestModel = {
          patientId: currentPatientProfile?.patientId ?? 0,
          phoneTypeCode: phoneTypeCode,
          phoneNumber: phoneNumber,
          listedAs: listedAs,
        };

        const newPatientPhone = await insertPatientPhone(
          insertPatientPhoneRequestModel
        );

        if (newPatientPhone) {
          const patientPhoneState: PatientPhoneState = {
            patientPhoneId: newPatientPhone.patientPhoneId,
            patientId: currentPatientProfile?.patientId ?? 0,
            phoneNumber: phoneNumber,
            phoneTypeCode: phoneTypeCode,
            phoneTypeName:
              phoneTypes?.find((type) => type.phoneTypeCode === phoneTypeCode)
                ?.phoneTypeName ?? "",
            listedAs: listedAs,
          };
          dispatch(setPatientPhone(patientPhoneState));
          result = true;
        }
      }
    } else {
      result = true;
    }
    return result;
  };

  const addNewOrUpdateExistingPatientEmail = async (
    emailAddress: string
  ): Promise<boolean> => {
    let result = false;
    if (emailAddress !== "") {
      if (currentPatientEmail && currentPatientEmail.patientEmailId > 0) {
        const updatePatientEmailRequestModel: UpdatePatientEmailRequestModel = {
          patientEmailId: currentPatientEmail.patientEmailId,
          emailAddress: emailAddress,
        };

        const updatedPatientEmail = await updatePatientEmail(
          updatePatientEmailRequestModel
        );
        if (updatedPatientEmail) {
          const patientEmailState: PatientEmailState = {
            patientEmailId: updatedPatientEmail?.patientEmailId ?? 0,
            patientId: currentPatientProfile?.patientId ?? 0,
            emailAddress,
          };
          dispatch(setPatientEmail(patientEmailState));
          result = true;
        }
      } else {
        const insertPatientEmailRequestModel: InsertPatientEmailRequestModel = {
          patientId: currentPatientProfile?.patientId ?? 0,
          emailAddress: emailAddress,
        };

        const newPatientEmail = await insertPatientEmail(
          insertPatientEmailRequestModel
        );
        if (newPatientEmail) {
          const patientPhoneState: PatientEmailState = {
            patientEmailId: newPatientEmail.patientEmailId,
            patientId: currentPatientProfile?.patientId ?? 0,
            emailAddress,
          };
          dispatch(setPatientEmail(patientPhoneState));
          result = true;
        }
      }
    } else {
      result = true;
    }
    return result;
  };

  const addNewPatientContacts = async (
    data: ContactFormValues
  ): Promise<boolean> => {
    let result = false;
    try {
      dispatch(setLoading(true));
      const [savedMobilePhone, savedHomePhone, savedOtherPhone, savedEmail] =
        await Promise.all([
          addNewOrUpdateExistingPatientPhone(
            PhoneTypeCode.MOBILE,
            data.mobilePhone ?? "",
            "Mobile"
          ),
          addNewOrUpdateExistingPatientPhone(
            PhoneTypeCode.HOME,
            data.homePhone ?? "",
            "Home"
          ),
          addNewOrUpdateExistingPatientPhone(
            PhoneTypeCode.OTHER,
            data.otherPhone ?? "",
            "Other"
          ),
          addNewOrUpdateExistingPatientEmail(data.email ?? ""),
        ]);
      result =
        savedMobilePhone && savedHomePhone && savedOtherPhone && savedEmail;

      if (result) {
        showSnackbar(t("patient.patientContactsAdded"), "success");
      } else {
        showSnackbar(t("patient.patientContactsNotAdded"), "error");
      }
    } catch (error) {
      console.error("Error inserting patient contacts:", error);
      showSnackbar(t("patientContactsAddeError"), "error");
    } finally {
      dispatch(setLoading(false));
    }

    return result;
  };

  const onSubmit = async (data: any) => {
    const result = await addNewPatientContacts(data);
    if (result) onNext();
  };

  useEffect(() => {
    getPhoneTypes().then((data) => setPhoneTypes(data));
  }, []);

  return (
    <Box
      sx={{ flexGrow: 1 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      marginTop={3}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ fontWeight: "bold" }}
          >
            {t("phoneNumbers")}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="mobilePhone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label={t("mobilePhone")}
                variant="outlined"
                size="small"
                fullWidth
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]*",
                }}
                error={!!errors.mobilePhone}
                helperText={errors.mobilePhone?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="homePhone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label={t("homePhone")}
                variant="outlined"
                size="small"
                fullWidth
                inputProps={{
                  maxLength: 15,
                  pattern: "[0-9]*",
                }}
                error={!!errors.homePhone}
                helperText={errors.homePhone?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="otherPhone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label={t("otherPhone")}
                variant="outlined"
                size="small"
                fullWidth
                inputProps={{
                  maxLength: 15,
                  pattern: "[0-9]*",
                }}
                error={!!errors.otherPhone}
                helperText={errors.otherPhone?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ fontWeight: "bold" }}
          >
            {t("email")}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label={t("email")}
                variant="outlined"
                size="small"
                fullWidth
                inputProps={{
                  maxLength: 100,
                }}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={onBack}
            >
              {t("back")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<ArrowForward />}
            >
              {t("next")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientContactAdd;
