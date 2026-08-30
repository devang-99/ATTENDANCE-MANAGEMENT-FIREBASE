"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { Batch, Subject } from "@/features/users/user.type";

interface AttendanceFiltersProps {
  selectedBatch: Batch | "";
  selectedSubject: Subject | "";

  onFilterChange: (batch: Batch | "", subject: Subject | "") => void;
}

const AttendanceFilters = ({
  selectedBatch,
  selectedSubject,
  onFilterChange,
}: AttendanceFiltersProps) => {
  const handleBatchChange = (batch: Batch) => {
    onFilterChange(batch, "");
  };

  const handleSubjectChange = (subject: Subject) => {
    onFilterChange(selectedBatch, subject);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {/* Batch */}

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Batch</InputLabel>

        <Select
          value={selectedBatch}
          label="Batch"
          onChange={(event) => handleBatchChange(event.target.value as Batch)}
        >
          {Object.values(Batch).map((batch) => (
            <MenuItem key={batch} value={batch}>
              {batch}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Subject */}

      <FormControl
        size="small"
        sx={{ minWidth: 200 }}
        disabled={!selectedBatch}
      >
        <InputLabel>Subject</InputLabel>

        <Select
          value={selectedSubject}
          label="Subject"
          onChange={(event) =>
            handleSubjectChange(event.target.value as Subject)
          }
        >
          {Object.values(Subject).map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default AttendanceFilters;
