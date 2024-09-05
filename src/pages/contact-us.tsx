import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

// Define an interface for the form values
interface ContactFormValues {
  name: string;
  phoneNumber: string;
  emailAddress: string;
  address: string;
  hearAboutUs: string;
}

// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  emailAddress: Yup.string().email("Invalid email format"),
  address: Yup.string(),
  hearAboutUs: Yup.string(),
});

const ContactUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(validationSchema) as any,
  });

  const onSubmit = (data: ContactFormValues) => {
    setSubmitted(true);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Us
        </Typography>
        {!submitted ? (
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  margin="normal"
                  label="Name"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name ? errors.name.message : ""}
                  inputProps={{ maxLength: 100 }}
                  data-testid="name-input"
                />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  margin="normal"
                  label="Phone Number"
                  variant="outlined"
                  error={!!errors.phoneNumber}
                  helperText={
                    errors.phoneNumber ? errors.phoneNumber.message : ""
                  }
                  inputProps={{ maxLength: 15 }}
                  data-testid="phone-number-input"
                />
              )}
            />
            <Controller
              name="emailAddress"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  variant="outlined"
                  error={!!errors.emailAddress}
                  helperText={
                    errors.emailAddress ? errors.emailAddress.message : ""
                  }
                  inputProps={{ maxLength: 100 }}
                  data-testid="email-address-input"
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  margin="normal"
                  label="Address"
                  variant="outlined"
                  multiline
                  rows={4}
                  error={!!errors.address}
                  helperText={errors.address ? errors.address.message : ""}
                  inputProps={{ maxLength: 250 }}
                  data-testid="address-input"
                />
              )}
            />
            <Controller
              name="hearAboutUs"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="hear-about-us-label">
                    Where did you hear about us?
                  </InputLabel>
                  <Select
                    {...field}
                    id="hear-about-us"
                    labelId="hear-about-us-label"
                    label="Where did you hear about us?"
                    error={!!errors.hearAboutUs}
                    data-testid="hear-about-us-select"
                  >
                    <MenuItem value="Social Media">Social Media</MenuItem>
                    <MenuItem value="Friend or Family">
                      Friend or Family
                    </MenuItem>
                    <MenuItem value="Online Search">Online Search</MenuItem>
                    <MenuItem value="Advertisement">Advertisement</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.hearAboutUs && (
                    <Typography color="error" data-testid="hear-about-us-error">
                      {errors.hearAboutUs.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                data-testid="submit-button"
              >
                Submit
              </Button>
            </Box>
          </form>
        ) : (
          <Typography variant="h6" component="p">
            Thank you for contacting us. Our representative will connect with
            you soon.
          </Typography>
        )}
      </Box>
      <Box mt={4} textAlign="center">
        <Typography variant="body1" component="p">
          © 2023 Company Name
        </Typography>
        <Box mt={2}>
          <Link href="https://www.linkedin.com" target="_blank" rel="noopener">
            <LinkedInIcon fontSize="large" />
          </Link>
          <Link
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener"
            mx={2}
          >
            <FacebookIcon fontSize="large" />
          </Link>
          <Link href="https://www.instagram.com" target="_blank" rel="noopener">
            <InstagramIcon fontSize="large" />
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactUs;
