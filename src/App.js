import { Box, Button, ButtonGroup, Flex, HStack, Input, SkeletonText, Text } from "@chakra-ui/react";
import { useJsApiLoader, GoogleMap, Autocomplete, DirectionsRenderer, MarkerF } from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: 23.2599, lng: 77.4126 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const originRef = useRef();
  const destinationRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateData() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearData() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  return (
    <Flex position="relative" flexDirection="column" alignItems="center" h="100vh" w="100vw">
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        <GoogleMap center={center} zoom={5} mapContainerStyle={{ height: "100%", width: "100%" }} onLoad={(map) => setMap(map)}>
          <MarkerF position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box maxW={{base: "90%", md: "50%"}} zIndex="1" bg="white" boxShadow="md" rounded="lg" mt={{base: "55px", md: "20px"}} p="20px">
        <HStack spacing="10px" justifyContent="space-between">
          <Autocomplete>
            <Input type="text" size={{base: "xs", md: "sm"}} placeholder="Origin" ref={originRef} />
          </Autocomplete>

          <Autocomplete>
            <Input type="text" size={{base: "xs", md: "sm"}} placeholder="Destination" ref={destinationRef} />
          </Autocomplete>

          <ButtonGroup>
            <Button type="submit" colorScheme="blue" size={{base: "xs", md: "sm"}} onClick={calculateData}>Calculate</Button>
            <Button type="button" colorScheme="red" size={{base: "xs", md: "sm"}} onClick={clearData}>Clear</Button>
          </ButtonGroup>
        </HStack>
        <HStack spacing="10px" justifyContent="space-between" mt="10px">
          <Text fontSize={{base: "xs", md: "sm"}}>Distance: {distance}</Text>
          <Text fontSize={{base: "xs", md: "sm"}}>Duration: {duration}</Text>
          <Button type="button" colorScheme="yellow" size={{base: "xs", md: "sm"}} onClick={() => map.panTo(center)}>Re-center</Button>
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
