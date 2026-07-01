package com.secure.analyticsservices.service;

import com.secure.analyticsservices.dto.AnalyticsResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public AnalyticsResponse getAnalytics() {

        AnalyticsResponse response = new AnalyticsResponse();

        long totalFIR = mongoTemplate.getCollection("firs").countDocuments();
        long totalCriminal = mongoTemplate.getCollection("criminals").countDocuments();

        response.setTotalFIR(totalFIR);
        response.setTotalCriminal(totalCriminal);

        response.setFirStatusCount(getGroupedCount("firs", "status"));
        response.setCriminalStatusCount(getGroupedCount("criminals", "arrestStatus"));

        return response;
    }

    private Map<String, Long> getGroupedCount(String collection, String field) {

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group(field).count().as("count")
        );

        AggregationResults<Map> results =
                mongoTemplate.aggregate(aggregation, collection, Map.class);

        List<Map> mapped = results.getMappedResults();

        Map<String, Long> result = new HashMap<>();

        for (Map map : mapped) {
            result.put(map.get("_id").toString(),
                    Long.parseLong(map.get("count").toString()));
        }

        return result;
    }
}
