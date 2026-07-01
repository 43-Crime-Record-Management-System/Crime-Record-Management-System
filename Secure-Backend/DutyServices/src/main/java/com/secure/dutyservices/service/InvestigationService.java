package com.secure.dutyservices.service;

import com.secure.dutyservices.entity.InvestigationEntry;
import java.util.List;

public interface InvestigationService {

    InvestigationEntry addEntry(InvestigationEntry entry);

    List<InvestigationEntry> getByFirId(String firId);
    
    InvestigationEntry updateStatus(String id, String status);
}

