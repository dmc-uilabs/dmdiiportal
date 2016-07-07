package com.ge.research.vehicleforge.seleniumtests;

import java.util.Random;

public class TestUtils {

    public static final int DEFAULT_IMPLICIT_TIMEOUT_SECONDS = 10;
    public static final boolean CREDENTIAL_GATEWAY_REQUIRED = true;
    public static final boolean ENABLE_JAVASCRIPT = true;
    
    public static final Random randomGenerator = new Random();
    public static final int ran = randomGenerator.nextInt(1000000);
    
    public static final String projectName = "Test Project " + ran;
    public static final String overview = "This is a test for adding project" + ran;
    public static final String ProjectTag = "Test tag" + ran;
    public static final String overviewEdit = "This is a test for editing project" + ran;
    public static final String ProjectTagEdit = "Test tag edited" + ran;


    /**
     * Uses java.net.URLEncoder to encode String as UTF-8.
     *
     * @param input String to encode.
     * @return UTF-8 encoded String.
     * @throws Exception If input is null or encoding error occurs.
     */
    public static String encodeUrl(String input) throws Exception {

        String output;

        try {
            output = java.net.URLEncoder.encode(input, "UTF-8");
        } catch (Exception e) {
            output = "";
        }

        return output;
    }
}
