import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Typography,
  List,
  ListItem,
  Box,
  IconButton,
  useMediaQuery,
  Pagination,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import {
  getPatientAddresses,
  getPatientData,
  getPatientEmails,
  getPatientIdentities,
  getPatientPhones,
  getPatientProfile,
} from "../../services/patient-service";
import {
  PatientSearchCriteria,
  PatientSearchResponseModel,
} from "../../models/patient";
import { format } from "date-fns";
import SelectIconButton from "../../components/select-icon-button";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loading-slice";
import {
  setPatientAddress,
  setPatientEmail,
  setPatientIdentity,
  setPatientPhones,
  setPatientProfile,
} from "../../store/patient-slice";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "../../components/Snackbar";

const AddPatientButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAddPatientClick = () => {
    navigate("/patients/add");
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="flex-end"
      marginTop={2}
    >
      <Typography variant="body2" marginRight={1}>
        {t("patient.registerNewPatientMessage")}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          backgroundColor: "#FF7F50",
          "&:hover": { backgroundColor: "#FF6347" },
        }}
        onClick={handleAddPatientClick}
      >
        {t("add")}
      </Button>
    </Box>
  );
};

interface SearchCriteria {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  identityNumber?: string;
  emailAddress?: string;
}

const PatientSearch: React.FC = () => {
  const pageSize = 10;

  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
  const textFieldBasicSearchRef = useRef<HTMLInputElement>(null);
  const textFieldFirstnamehRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [identifiedKeywords, setIdentifiedKeywords] = useState<
    { type: string; value: string }[]
  >([]);
  const [searchResults, setSearchResults] = useState<
    PatientSearchResponseModel[]
  >([]);
  const [searched, setSearched] = useState(false);

  const columns = [
    {
      field: "select",
      headerName: t("select"),
      width: 50,
      renderCell: (params: any) => (
        <SelectIconButton
          onClick={() => {
            handleSelectPatient(params.row);
          }}
        />
      ),
    },
    { field: "firstname", headerName: t("firstName"), width: 150 },
    { field: "lastname", headerName: t("lastName"), width: 150 },
    {
      field: "dateOfBirth",
      headerName: t("dob"),
      width: 100,
      valueFormatter: (params: any) => {
        if (!params) return "";
        return format(params, "yyyy-MM-dd");
      },
    },
    { field: "gender", headerName: t("gender"), width: 100 },
    { field: "phoneNumbersString", headerName: t("phoneNumbers"), width: 200 },
    {
      field: "emailAddressesString",
      headerName: t("email"),
      width: 200,
    },
    {
      field: "identityNumbersString",
      headerName: t("identityNumber"),
      width: 150,
    },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "f") {
        // Ctrl+F focuses the search input
        event.preventDefault();
        focusSearchInput(isAdvancedSearch);
      }

      // Add more keyboard shortcuts here
    };

    focusSearchInput(isAdvancedSearch);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAdvancedSearch]);

  useEffect(() => {
    // Whenever searchTerm changes, reset searchResults to an empty array
    setSearchResults([]);
    setSearched(false);
  }, [searchTerm, searchCriteria]);

  const focusSearchInput = (useAdvancedSearch: boolean) => {
    if (useAdvancedSearch) {
      if (textFieldFirstnamehRef.current) {
        textFieldFirstnamehRef.current.focus();
      }
    } else {
      if (textFieldBasicSearchRef.current) {
        textFieldBasicSearchRef.current.focus();
      }
    }
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    identifyKeywords(term);
  };

  const identifyKeywords = (term: string) => {
    const keywords: { type: string; value: string }[] = [];
    const patterns = {
      dateOfBirth: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
      phoneNumber: /^\d{10}$/, // 10 digit phone number
      identityNumber: /#[a-zA-Z0-9]+/,
      emailAddress: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email pattern
    };

    const terms = term.split(" ");
    terms.forEach((tm) => {
      if (patterns.dateOfBirth.test(tm)) {
        replaceOrAddKeyword(keywords, t("dob"), tm);
      } else if (patterns.phoneNumber.test(tm)) {
        replaceOrAddKeyword(keywords, t("phoneNumber"), tm);
      } else if (patterns.identityNumber.test(tm)) {
        replaceOrAddKeyword(
          keywords,
          t("identityNumber"),
          tm.replace(/#/g, "")
        );
      } else if (patterns.emailAddress.test(tm)) {
        replaceOrAddKeyword(keywords, t("emailAddress"), tm);
      } else if (keywords.findIndex((k) => k.type === t("firstName")) === -1) {
        replaceOrAddKeyword(keywords, t("firstName"), tm);
      } else {
        appendToLastName(keywords, tm);
      }
    });

    setIdentifiedKeywords(keywords);
  };

  const replaceOrAddKeyword = (
    keywords: { type: string; value: string }[],
    type: string,
    value: string
  ) => {
    const index = keywords.findIndex((k) => k.type === type);
    if (index !== -1) {
      keywords[index].value = value;
    } else {
      keywords.push({ type, value });
    }
  };

  const appendToLastName = (
    keywords: { type: string; value: string }[],
    value: string
  ) => {
    const index = keywords.findIndex((k) => k.type === t("lastName"));
    if (index !== -1) {
      keywords[index].value += ` ${value}`;
    } else {
      keywords.push({ type: t("lastName"), value });
    }
  };

  const performSearch = async () => {
    dispatch(setLoading(true));
    try {
      const criteria: PatientSearchCriteria = {};
      if (!isAdvancedSearch) {
        if (identifiedKeywords.length > 0) {
          identifiedKeywords.forEach((keyword) => {
            switch (keyword.type) {
              case t("firstName"):
                criteria.firstName = keyword.value;
                break;
              case t("lastName"):
                criteria.lastName = keyword.value;
                break;
              case t("phoneNumber"):
                criteria.phoneNumber = keyword.value;
                break;
              case t("identityNumber"):
                criteria.identityNumber = keyword.value;
                break;
              case t("emailAddress"):
                criteria.email = keyword.value;
                break;
              case t("dob"):
                criteria.dateOfBirth = new Date(keyword.value);
                break;
              default:
                break;
            }
          });
        }
      } else {
        if (searchCriteria.firstName)
          criteria.firstName = searchCriteria.firstName;
        if (searchCriteria.lastName)
          criteria.lastName = searchCriteria.lastName;
        if (searchCriteria.dateOfBirth)
          criteria.dateOfBirth = searchCriteria.dateOfBirth;
        if (searchCriteria.phoneNumber)
          criteria.phoneNumber = searchCriteria.phoneNumber;
        if (searchCriteria.identityNumber)
          criteria.identityNumber = searchCriteria.identityNumber;
        if (searchCriteria.emailAddress)
          criteria.email = searchCriteria.emailAddress;
      }

      const hasCriteriaValue = Object.values(criteria).some(
        (value) => value !== null && value !== undefined && value !== ""
      );
      if (hasCriteriaValue) {
        const results = await getPatientData(criteria);

        if (results && results.length > 0) {
          setSearchResults(results);
        } else {
          showSnackbar(t("noResultsFound"), "warning");
          setSearchResults([]);
        }
      }
      setSearched(true);
    } catch (error) {
      console.error("Error searching patient data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const paginatedResults = searchResults.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleInputChange =
    (field: keyof SearchCriteria) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchCriteria({
        ...searchCriteria,
        [field]: event.target.value,
      });
    };

  const handleDateChange =
    (field: keyof SearchCriteria) => (date: Date | null) => {
      setSearchCriteria({
        ...searchCriteria,
        [field]: date,
      });
    };

  const handleSelectPatient = async (patient: PatientSearchResponseModel) => {
    console.log("Selected patient:", patient);
    const [
      patientProfileState,
      patientIdentities,
      patientAddresses,
      patientPhones,
      patientEmails,
    ] = await Promise.all([
      getPatientProfile(patient.patientId),
      getPatientIdentities(patient.patientId),
      getPatientAddresses(patient.patientId),
      getPatientPhones(patient.patientId),
      getPatientEmails(patient.patientId),
    ]);

    dispatch(setPatientProfile(patientProfileState));
    const latestPatientIdentity = patientIdentities.sort(
      (a, b) => b.patientIdentityId - a.patientIdentityId
    )[0];
    dispatch(setPatientIdentity(latestPatientIdentity));
    const latestPatientAddress = patientAddresses.sort(
      (a, b) => b.patientAddressId - a.patientAddressId
    )[0];
    dispatch(setPatientAddress(latestPatientAddress));
    dispatch(setPatientPhones(patientPhones));
    const latestPatientEmail = patientEmails.sort(
      (a, b) => b.patientEmailId - a.patientEmailId
    )[0];
    dispatch(setPatientEmail(latestPatientEmail));
    navigate("/patients/information");
  };

  const handleToggleSearch = () => {
    setIsAdvancedSearch((prev) => !prev);
    setSearchTerm("");
    setSearchCriteria({});
    focusSearchInput(isAdvancedSearch);
  };

  return (
    <Box marginTop={2}>
      <Typography variant="h6" component="h2">
        {t("patient.searchTitle")}
      </Typography>
      {!isAdvancedSearch ? (
        <>
          <TextField
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            onKeyDown={handleKeyPress}
            placeholder={t("patient.searchPlaceholder")}
            variant="outlined"
            fullWidth
            margin="normal"
            inputRef={textFieldBasicSearchRef}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={performSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handleToggleSearch} variant="text" color="primary">
              {t("advancedSearch")}
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} md={4}>
              <TextField
                label={t("firstName")}
                variant="outlined"
                fullWidth
                size="small"
                value={searchCriteria.firstName || ""}
                onChange={handleInputChange("firstName")}
                inputRef={textFieldFirstnamehRef}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={t("lastName")}
                variant="outlined"
                fullWidth
                size="small"
                value={searchCriteria.lastName || ""}
                onChange={handleInputChange("lastName")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label={t("dob")}
                value={searchCriteria.dateOfBirth || null}
                onChange={handleDateChange("dateOfBirth")}
                format="yyyy-MM-dd"
                disableFuture
                slotProps={{
                  textField: {
                    variant: "outlined",
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={t("phoneNumber")}
                variant="outlined"
                fullWidth
                size="small"
                value={searchCriteria.phoneNumber || ""}
                onChange={handleInputChange("phoneNumber")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={t("identityNumber")}
                variant="outlined"
                fullWidth
                size="small"
                value={searchCriteria.identityNumber || ""}
                onChange={handleInputChange("identityNumber")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={t("email")}
                variant="outlined"
                fullWidth
                size="small"
                value={searchCriteria.emailAddress || ""}
                onChange={handleInputChange("emailAddress")}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                endIcon={<SearchIcon />}
                onClick={performSearch}
              >
                {t("search")}
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                onClick={handleToggleSearch}
                variant="text"
                color="primary"
              >
                {t("simpleSearch")}
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      <div>
        {searchTerm && identifiedKeywords.length !== 0 && (
          <Typography variant="body2" component="h3">
            {t("identifiedKeywords")}
          </Typography>
        )}

        <List sx={{ padding: 0 }}>
          {searchTerm &&
            identifiedKeywords.map((keyword, index) => (
              <ListItem key={index} sx={{ padding: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "grey.500", fontStyle: "italic" }}
                >
                  {`${keyword.type}: ${keyword.value}`}
                </Typography>
              </ListItem>
            ))}
        </List>
        <Box>
          {isMobile ? (
            <Box marginTop={2}>
              {paginatedResults.map((patient) => (
                <Card
                  key={patient.patientId}
                  sx={{
                    mb: 2,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{`${patient.firstname} ${patient.lastname}`}</Typography>
                    <Typography variant="body2">{patient.gender}</Typography>
                    <Typography variant="body2">{`${t("phoneNumbers")}: ${
                      patient.phoneNumbersString
                    }`}</Typography>
                    <Typography variant="body2">{`${t("email")}: ${
                      patient.emailAddress
                    }`}</Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      justifyContent: "flex-end",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSelectPatient(patient)}
                      size="small"
                    >
                      {t("select")}
                    </Button>
                  </CardActions>
                </Card>
              ))}
              {paginatedResults.length > 0 && (
                <>
                  <Pagination
                    count={Math.ceil(searchResults.length / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    sx={{ mt: 2 }}
                  />
                </>
              )}
            </Box>
          ) : (
            searchResults.length > 0 && (
              <Box marginTop={2} height={400}>
                <DataGrid
                  rows={searchResults}
                  columns={columns}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 },
                    },
                  }}
                  pagination
                  getRowId={(row) => row.patientId}
                />
              </Box>
            )
          )}
          {searched && <AddPatientButton />}
        </Box>
      </div>
    </Box>
  );
};

export default PatientSearch;
