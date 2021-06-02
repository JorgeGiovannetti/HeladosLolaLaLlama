import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { storage } from "../../firebase";
import { useHistory } from "react-router-dom";
import {
  Box,
  Stack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  Image,
  Text,
  Textarea,
  Progress,
  FormErrorMessage,
  CircularProgress,
  useColorModeValue,
} from "@chakra-ui/react";
import Dropzone from "react-dropzone";
import { formatBytes } from "./formatBytes";
import "./dropzone.css";

const ProductForm = ({ currProducto }) => {
  const [formAlert, setFormAlert] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [productImage, setProductImage] = useState(
    currProducto?.image ? [currProducto.image] : []
  );
  const [imageError, setImageError] = useState({});

  const history = useHistory();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (currProducto) {
      setProductImage(currProducto?.image ? [currProducto.image] : []);
      setValue("name", currProducto.name);
      setValue("description", currProducto.description);
      setValue("location", currProducto.location);
      setValue("contactName", currProducto.contactName);
      setValue("contactMail", currProducto.contactMail);
    }
  }, [currProducto, setValue]);

  const uploadProduct = async (values) => {
    const producto = {
      name: values.name,
      description: values.description,
      location: values.location,
      contactName: values.contactName,
      contactMail: values.contactMail,
    };

    // Upload image if needed

    // Upload to server

    setIsUploading(false);
  };

  const onSubmit = (values) => {
    if (!!!productImage || productImage?.length === 0) {
      setImageError({ message: "Adjunta imagen del producto" });
      return;
    }

    setIsLoading(true);

    values.image = productImage[0];

    uploadProduct(values)
      .then((_) => {
        setFormAlert({
          status: "success",
          message: "Producto registrado!",
        });
        setTimeout(() => {
          history.push("/productos");
        }, 2000);
      })
      .catch((_) => {
        setFormAlert({
          status: "alert",
          message: "El producto no pudo ser registrado",
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          w={"100%"}
          p={8}
        >
          {formAlert && (
            <Box my={4}>
              <Alert status={formAlert.status} borderRadius={4}>
                <AlertIcon />
                <AlertDescription>{formAlert.message}</AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => setFormAlert(null)}
                />
              </Alert>
            </Box>
          )}
          <Stack spacing={4}>
            <FormControl
              id="name"
              isInvalid={!!errors?.name?.message}
              errortext={errors?.name?.message}
            >
              <FormLabel>Nombre de producto</FormLabel>
              <Input
                type="text"
                defaultValue={currProducto?.name}
                {...register("name", {
                  required: "Ingresa el nombre del producto",
                })}
              />
              <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="description"
              isInvalid={!!errors?.description?.message}
              errortext={errors?.description?.message}
            >
              <FormLabel>Descripción de producto</FormLabel>
              <Textarea
                type="text"
                defaultValue={currProducto?.description}
                {...register("description", {
                  required: "Ingresa la descripción del producto",
                })}
              />
              <FormErrorMessage>
                {errors?.description?.message}
              </FormErrorMessage>
            </FormControl>
            <HStack>
              <FormControl
                id="location"
                isInvalid={!!errors?.location?.message}
                errortext={errors?.location?.message}
              >
                <FormLabel>Ubicación de producto</FormLabel>
                <Input
                  type="text"
                  defaultValue={currProducto?.location}
                  {...register("location", {
                    required: "Ingresa la ubicación del producto",
                  })}
                />
                <FormErrorMessage>{errors?.location?.message}</FormErrorMessage>
              </FormControl>
            </HStack>
            <HStack>
              <FormControl
                id="contactName"
                isInvalid={!!errors?.contactName?.message}
                errortext={errors?.contactName?.message}
              >
                <FormLabel>Nombre de contacto</FormLabel>
                <Input
                  type="text"
                  defaultValue={currProducto?.contactName}
                  {...register("contactName", {
                    required: "Ingresa el nombre del producto",
                  })}
                />
                <FormErrorMessage>
                  {errors?.contactName?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="contactMail"
                isInvalid={!!errors?.contactMail?.message}
                errortext={errors?.contactMail?.message}
              >
                <FormLabel>Correo de contacto</FormLabel>
                <Input
                  type="email"
                  defaultValue={currProducto?.contactMail}
                  {...register("contactMail", {
                    required: "Ingresa el del producto",
                  })}
                />
                <FormErrorMessage>
                  {errors?.contactMail?.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl
              id="image"
              isInvalid={imageError.message}
              errortext={imageError.message}
            >
              <FormLabel>Imagen de producto</FormLabel>
              <Dropzone
                accept={"image/*"}
                maxSize={5242880}
                onDrop={(acceptedFiles, fileRejections) => {
                  setImageError({});

                  fileRejections.forEach((file) => {
                    file.errors.forEach((err) => {
                      if (err.code === "file-too-large") {
                        setImageError({
                          message:
                            "El archivo ingresado sobrepasa el límite de tamaño (5 MB)",
                        });
                      }

                      if (err.code === "file-invalid-type") {
                        setImageError({
                          message:
                            "El archivo ingresado no cumple con formato de imagen",
                        });
                      }
                    });
                  });

                  acceptedFiles.map((file) =>
                    Object.assign(file, {
                      preview: URL.createObjectURL(file),
                      formattedSize: formatBytes(file.size),
                    })
                  );
                  setProductImage(acceptedFiles);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className={`chakra-dropzone`} {...getRootProps()}>
                    <Input {...getInputProps()} />
                    <p>
                      Arrastra archivos aquí o haz click para subir. (max. 5 MB)
                    </p>
                  </div>
                )}
              </Dropzone>
              <FormErrorMessage>{imageError.message}</FormErrorMessage>
              {productImage &&
                productImage.map((file, index) => (
                  <Box
                    maxH={"65px"}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    my={"2"}
                    key={index}
                  >
                    <HStack>
                      {file.name ? (
                        <>
                          <Image h={"65px"} mr={"2"} src={file.preview} />
                          <Text>{file.name}</Text>
                          <Spacer />
                          <Text>{file.formattedSize}</Text>
                        </>
                      ) : (
                        <>
                          <Image h={"65px"} mr={"2"} src={file} />
                          <Text>Imagen guardada en servidor</Text>
                          <Spacer />
                        </>
                      )}
                      <Box px={"3"}>
                        <CloseButton
                          onClick={(_) => {
                            let images = [...productImage];
                            images.splice(index, 1);
                            setProductImage(images);
                          }}
                        />
                      </Box>
                    </HStack>
                  </Box>
                ))}
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"purple.400"}
                color={"white"}
                _hover={{
                  bg: "purple.500",
                }}
                type={"submit"}
                isDisabled={isLoading || isUploading}
              >
                {isLoading ? (
                  <CircularProgress isIndeterminate size="24px" color="teal" />
                ) : (
                  "Guardar producto"
                )}
              </Button>
              {isUploading && <Progress hasStripe value={uploadProgress} />}
            </Stack>
          </Stack>
        </Box>
      </form>
    </>
  );
};

export default ProductForm;
