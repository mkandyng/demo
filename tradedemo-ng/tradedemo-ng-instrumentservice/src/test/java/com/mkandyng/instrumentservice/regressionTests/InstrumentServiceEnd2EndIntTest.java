package com.mkandyng.instrumentservice.regressionTests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.skyscreamer.jsonassert.JSONAssert;
import org.skyscreamer.jsonassert.JSONCompareMode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.stream.IntStream;

import static org.assertj.core.api.Java6Assertions.assertThat;

/**
 *
 * Regression Test the InstrumentService API for both success and failure
 * execution paths
 *
 */

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class InstrumentServiceEnd2EndIntTest {

    @Autowired
    private TestRestTemplate restTemplate;

    // Attributes we do not want to verify
    private final String[] ignoreVerifyAttributes = new String[]{"timestamp", "version"};

    @Test
    public void runRegressionTestCases() throws Exception {
        printHeader('#');
        System.out.println("Running Regression Tests for InstrumentService");
        printHeader('#');

        for(TestCaseEnum testCaseEnum: TestCaseEnum.values()) {

            // Given
            String restEndPoint = testCaseEnum.getRestEndpoint();
            printHeader('-');
            System.out.println(String.format("Running test case [%s], rest API [%s]", testCaseEnum, restEndPoint));
            printHeader('-');


            // When
            ResponseEntity<String> response = restTemplate.getForEntity(restEndPoint, String.class);



            // Then
            System.out.println("Actual: " + response.getBody());
            assertThat(response.getStatusCode()).isEqualTo(testCaseEnum.getHttpStatus());
            if(!response.getBody().startsWith("<!DOCTYPE html>")) {
                String expectOutput = convertToJsonString(getExpectedOutput(testCaseEnum));
                System.out.println("Expect: " + getExpectedOutput(testCaseEnum));
                JSONAssert.assertEquals(
                        removeAttributesInComparison(expectOutput),
                        removeAttributesInComparison(response.getBody()),
                        JSONCompareMode.STRICT
                );
            } else {
                System.out.println("Expect: A logon page");
                assertThat(response.getBody()).contains("/login");
            }
        }
    }

    private String getExpectedOutput(TestCaseEnum testCaseEnum) throws Exception {
        URL url = getClass().getResource(testCaseEnum.getExpectedOutput());
        if(url == null) {
            throw new RuntimeException(String.format("Expected Output %s not found, please check!", testCaseEnum.getExpectedOutput()));
        }
        return new String ( Files.readAllBytes( Paths.get(url.toURI()) ) );
    }

    private String convertToJsonString(String content) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readValue(content, JsonNode.class);
        return jsonNode.toString();
    }

    private String removeAttributesInComparison(String jsonContent) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readValue(jsonContent, JsonNode.class);
        removeIgnoreAttributes(rootNode);
        return rootNode.toString();
    }

    private void removeIgnoreAttributes(JsonNode node) {
        if(node instanceof ObjectNode) {
            ObjectNode object = (ObjectNode) node;
            Arrays.stream(ignoreVerifyAttributes).forEach(object::remove);
            node.forEach(e -> removeIgnoreAttributes(e));
        }
    }

    private void printHeader(char character) {
        IntStream.range(0,100).forEach(e->System.out.print(character));
        System.out.println();
    }
}