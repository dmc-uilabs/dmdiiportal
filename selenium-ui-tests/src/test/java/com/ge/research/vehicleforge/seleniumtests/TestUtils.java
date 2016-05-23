package com.ge.research.vehicleforge.seleniumtests;

import java.util.Random;

/**
 *
 * @author Adam Myatt
 * @author Amine Chigani
 */
public class TestUtils {
	
    public static final int DEFAULT_IMPLICIT_TIMEOUT_SECONDS = 10;
    public static final boolean CREDENTIAL_GATEWAY_REQUIRED = true;
    public static final boolean ENABLE_JAVASCRIPT = true;
    
    public static final Random randomGenerator = new Random();
    public static final int ran = randomGenerator.nextInt(1000000);

    public static final String TITLE_DMC = "Digital Manufacturing Commons";
    public static final String TITLE_OPENDMC = "OPENDMC";
    
    

    
    
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
