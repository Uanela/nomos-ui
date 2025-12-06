import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "../select";
import type { SelectOption } from "../select";

const mockOptions: SelectOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Select Component", () => {
  describe("Single Selection Mode", () => {
    it("renders without crashing", () => {
      render(<Select options={mockOptions} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(<Select options={mockOptions} label="Test Label" />);
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("shows required asterisk when required and showRequiredSign are true", () => {
      const { container } = render(
        <Select
          options={mockOptions}
          label="Required Field"
          required
          showRequiredSign
        />
      );
      const asterisk = container.querySelector("svg");
      expect(asterisk).toBeInTheDocument();
    });

    it("does not show asterisk when showRequiredSign is false", () => {
      const { container } = render(
        <Select
          options={mockOptions}
          label="Required Field"
          required
          showRequiredSign={false}
        />
      );
      const asterisks = container.querySelectorAll('[color="red"]');
      expect(asterisks.length).toBe(0);
    });

    it("displays placeholder when no value is selected", () => {
      render(<Select options={mockOptions} placeholder="Select an option" />);
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("displays selected value", () => {
      render(
        <Select
          options={mockOptions}
          value="option1"
          placeholder="Select an option"
        />
      );
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    it("calls onChange when option is selected", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={mockOptions}
          onChange={handleChange}
          placeholder="Select"
        />
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const option = screen.getByText("Option 2");
        expect(option).toBeInTheDocument();
      });

      const option = screen.getByText("Option 2");
      await user.click(option);

      expect(handleChange).toHaveBeenCalledWith("option2");
    });

    it("renders all options when opened", async () => {
      const user = userEvent.setup();

      render(<Select options={mockOptions} placeholder="Select" />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
        expect(screen.getByText("Option 3")).toBeInTheDocument();
      });
    });

    it("displays tip message when provided and no error", () => {
      render(<Select options={mockOptions} tip="This is a helpful tip" />);
      expect(screen.getByText("This is a helpful tip")).toBeInTheDocument();
      expect(screen.getByText("This is a helpful tip")).toHaveClass(
        "text-muted-foreground"
      );
    });

    it("displays error message when provided", () => {
      render(<Select options={mockOptions} error="This field is required" />);
      expect(screen.getByText("*This field is required")).toBeInTheDocument();
      expect(screen.getByText("*This field is required")).toHaveClass(
        "text-destructive"
      );
    });

    it("hides tip when error is present", () => {
      render(
        <Select options={mockOptions} tip="Helpful tip" error="Error message" />
      );
      expect(screen.queryByText("Helpful tip")).not.toBeInTheDocument();
      expect(screen.getByText("*Error message")).toBeInTheDocument();
    });

    it("applies custom className to container", () => {
      const { container } = render(
        <Select options={mockOptions} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies custom labelProps className", () => {
      render(
        <Select
          options={mockOptions}
          label="Test"
          labelProps={{ className: "custom-label" }}
        />
      );
      expect(screen.getByText("Test")).toHaveClass("custom-label");
    });

    it("applies custom triggerProps className", () => {
      render(
        <Select
          options={mockOptions}
          triggerProps={{ className: "custom-trigger" }}
        />
      );
      expect(screen.getByRole("combobox")).toHaveClass("custom-trigger");
    });
  });

  describe("Multiple Selection Mode", () => {
    it("renders in multiple mode", () => {
      render(<Select options={mockOptions} multiple />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("displays placeholder when no values selected", () => {
      render(
        <Select options={mockOptions} multiple placeholder="Select multiple" />
      );
      expect(screen.getByText("Select multiple")).toBeInTheDocument();
    });

    it("displays selected values as tags", () => {
      render(
        <Select options={mockOptions} multiple value={["option1", "option2"]} />
      );
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("adds value when clicking unselected option", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={mockOptions}
          multiple
          value={["option1"]}
          onChange={handleChange}
        />
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const option = screen.getByText("Option 2");
        expect(option).toBeInTheDocument();
      });

      const option = screen.getByText("Option 2");
      await user.click(option);

      expect(handleChange).toHaveBeenCalledWith(["option1", "option2"]);
    });

    it("removes value when clicking selected option", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={mockOptions}
          multiple
          value={["option1", "option2"]}
          onChange={handleChange}
        />
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const options = screen.getAllByText("Option 1");
        expect(options.length).toBeGreaterThan(1);
      });

      const options = screen.getAllByText("Option 1");
      const dropdownOption = options.find((el) =>
        el.closest('[role="option"]')
      );

      if (dropdownOption) {
        await user.click(dropdownOption);
      }

      expect(handleChange).toHaveBeenCalledWith(["option2"]);
    });

    it("removes tag when clicking X button", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={mockOptions}
          multiple
          value={["option1", "option2"]}
          onChange={handleChange}
        />
      );

      const tags: any = screen.getAllByText("Option 1");
      const tagContainer = tags[0].closest?.("div");
      const xButton = tagContainer?.querySelector("svg");

      expect(xButton).toBeInTheDocument();

      if (xButton) {
        await user.click(xButton);
        expect(handleChange).toHaveBeenCalledWith(["option2"]);
      }
    });

    it("highlights selected options in dropdown", async () => {
      const user = userEvent.setup();

      render(<Select options={mockOptions} multiple value={["option1"]} />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const option = screen.getByRole("option", { name: "Option 1" });
        expect(option).toBeInTheDocument();
        expect(option).toHaveClass("bg-blue-50");
      });
    });

    it("handles empty array value", () => {
      render(
        <Select
          options={mockOptions}
          multiple
          value={[]}
          placeholder="Select items"
        />
      );
      expect(screen.getByText("Select items")).toBeInTheDocument();
    });

    it("handles adding to empty array", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={mockOptions}
          multiple
          value={[]}
          onChange={handleChange}
        />
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const option = screen.getByText("Option 1");
        expect(option).toBeInTheDocument();
      });

      const option = screen.getByText("Option 1");
      await user.click(option);

      expect(handleChange).toHaveBeenCalledWith(["option1"]);
    });

    it("displays tip and error in multiple mode", () => {
      const { rerender } = render(
        <Select options={mockOptions} multiple tip="Select multiple items" />
      );
      expect(screen.getByText("Select multiple items")).toBeInTheDocument();

      rerender(
        <Select
          options={mockOptions}
          multiple
          tip="Select multiple items"
          error="At least one required"
        />
      );
      expect(
        screen.queryByText("Select multiple items")
      ).not.toBeInTheDocument();
      expect(screen.getByText("*At least one required")).toBeInTheDocument();
    });

    it("applies custom itemProps className to selected items", async () => {
      const user = userEvent.setup();

      render(
        <Select
          options={mockOptions}
          multiple
          value={["option1"]}
          itemProps={{ className: "custom-item" }}
        />
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const option = screen.getByRole("option", { name: "Option 1" });
        expect(option).toBeInTheDocument();
        expect(option).toHaveClass("custom-item");
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles options with React nodes as labels", () => {
      const customOptions: SelectOption[] = [
        { value: "1", label: <span>Custom Label 1</span> },
        { value: "2", label: <strong>Bold Label</strong> },
      ];

      render(<Select options={customOptions} value="1" />);
      expect(screen.getByText("Custom Label 1")).toBeInTheDocument();
    });

    it("handles onChange being undefined", async () => {
      const user = userEvent.setup();

      render(<Select options={mockOptions} placeholder="Select" />);

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const option = screen.getByText("Option 1");
        expect(option).toBeInTheDocument();
      });

      const option = screen.getByText("Option 1");
      await user.click(option);

      // Should not throw error
      expect(true).toBe(true);
    });

    it("handles removing tag when onChange is undefined in multiple mode", async () => {
      const user = userEvent.setup();

      render(<Select options={mockOptions} multiple value={["option1"]} />);

      const tags: any = screen.getAllByText("Option 1");
      const tagContainer = tags[0].closest("div");
      const xButton = tagContainer?.querySelector("svg");

      if (xButton) {
        await user.click(xButton);
        // Should not throw error
        expect(true).toBe(true);
      }
    });

    it("handles non-array value in multiple mode gracefully", async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Select
          options={mockOptions}
          multiple
          value={undefined}
          onChange={handleChange}
        />
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const option = screen.getByText("Option 1");
        expect(option).toBeInTheDocument();
      });

      const option = screen.getByText("Option 1");
      await user.click(option);

      expect(handleChange).toHaveBeenCalledWith(["option1"]);
    });

    it("renders empty options array", () => {
      render(<Select options={[]} placeholder="No options" />);
      expect(screen.getByText("No options")).toBeInTheDocument();
    });

    it("applies all custom props simultaneously", () => {
      const { container } = render(
        <Select
          options={mockOptions}
          className="container-class"
          label="Full Test"
          labelProps={{ className: "label-class" }}
          triggerProps={{ className: "trigger-class" }}
          contentProps={{ className: "content-class" }}
          valueProps={{ className: "value-class" }}
          groupProps={{ className: "group-class" }}
          itemProps={{ className: "item-class" }}
        />
      );

      expect(container.firstChild).toHaveClass("container-class");
      expect(screen.getByText("Full Test")).toHaveClass("label-class");
      expect(screen.getByRole("combobox")).toHaveClass("trigger-class");
    });
  });
});
