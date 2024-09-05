import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactUs from "./contact-us";

describe("ContactUs Component", () => {
  test("renders Contact Us form", () => {
    render(<ContactUs />);
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  test("renders form fields", () => {
    render(<ContactUs />);
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("phone-number-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-address-input")).toBeInTheDocument();
    expect(screen.getByTestId("address-input")).toBeInTheDocument();
    expect(screen.getByTestId("hear-about-us-select")).toBeInTheDocument();
  });

  test("shows validation errors on submit with empty fields", async () => {
    render(<ContactUs />);
    fireEvent.click(screen.getByTestId("submit-button"));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(
      await screen.findByText("Phone Number is required")
    ).toBeInTheDocument();
  });

  test("submits the form with valid data", async () => {
    render(<ContactUs />);

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("phone-number-input"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByTestId("email-address-input"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByTestId("address-input"), {
      target: { value: "123 Main St" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    expect(
      await screen.findByText(
        "Thank you for contacting us. Our representative will connect with you soon."
      )
    ).toBeInTheDocument();
  });

  test("selects an option from the dropdown", () => {
    render(<ContactUs />);

    // Open the dropdown
    fireEvent.mouseDown(screen.getByTestId("hear-about-us-select"));

    // Select the option
    fireEvent.click(screen.getByText("Social Media"));

    // Optionally, you can assert that the value has been set correctly
    expect(screen.getByTestId("hear-about-us-select")).toHaveTextContent(
      "Social Media"
    );
  });
});
