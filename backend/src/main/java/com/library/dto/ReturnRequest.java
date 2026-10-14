package com.library.dto;

public class ReturnRequest {

    private String notes;
    private Boolean waiveFine = false;

    public ReturnRequest() {}

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getWaiveFine() {
        return waiveFine != null && waiveFine;
    }

    public void setWaiveFine(Boolean waiveFine) {
        this.waiveFine = waiveFine;
    }
}
