package com.ge.research.vehicleforge.seleniumtests;

import java.util.Random;

/**
 *
 * @author Adam Myatt
 * @author Amine Chigani
 */
public class TestUtils {


    //public static final String BASE_URL = "https://test.projectdmc.org/";
    //public static final String BASE_URL = "http://ec2-52-37-215-63.us-west-2.compute.amazonaws.com/";
    //public static final String BASE_URL = "http://52.33.101.137/";
	public static final String BASE_URL = "http://52.37.215.63/";
	//public static final String BASE_URL = "https://ben-web.opendmc.org/";


    public static final int DEFAULT_IMPLICIT_TIMEOUT_SECONDS = 10;
    public static final boolean CREDENTIAL_GATEWAY_REQUIRED = true;
/*    public static final String CREDENTIAL_GATEWAY_USER = "dmcuser01@gmail.com";
    public static final String CREDENTIAL_GATEWAY_PASS = "dmcuser01!";*/
    public static final String CREDENTIAL_FORGE_USER = "selenium";
    public static final String CREDENTIAL_FORGE_PASS = "VFseleniumTester";
    public static final String USER_FULL_NAME = "Selenium Tester";
    public static final String USER_EMAIL = "dmdi.dmc@ge.com";
    public static final boolean ENABLE_JAVASCRIPT = true;

    public static final Random randomGenerator = new Random();
    public static final int ran = randomGenerator.nextInt(1000000);

    public static final String TITLE_DMC = "Digital Manufacturing Commons";
    public static final String TITLE_OPENDMC = "OPENDMC";

    public static String getHeader(){
    	return System.currentTimeMillis() + ": ";
    }
    





    /**
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
